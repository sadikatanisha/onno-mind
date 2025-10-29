import { z } from "zod";
import type { NormalizedSource } from "./search";

export type DraftCard = {
  front: string
  back: string
  codeSnippet?: string
  difficulty?: number
}

const YouAgentResponseSchema = z.object({
  output: z.array(z.object({
    type: z.string(),
    text: z.string(),
    content: z.string().optional(),
    agent: z.string(),
  }))
});

export async function generateFlashcards(args: {
  topic: string
  summary?: string
  sources?: NormalizedSource[]
}): Promise<DraftCard[]> {
  if (!process.env.YOU_API_KEY) {
    throw new Error("YOU_API_KEY not configured");
  }

  try {
    const prompt = `You are an expert educational content creator. Create flashcards for the topic "${args.topic}".

${args.summary ? `Summary: ${args.summary}` : ''}

${args.sources ? `Sources: ${args.sources.map(s => s.title).join(', ')}` : ''}

Generate 5-10 high-quality flashcards with:
- Clear, concise front and back text
- Code snippets where relevant (in codeSnippet field)
- Difficulty rating 1-5
- Focus on key concepts, facts, and definitions

Return ONLY a valid JSON array in this exact format:
[
  {
    "front": "Question or term",
    "back": "Answer or definition", 
    "codeSnippet": "optional code example",
    "difficulty": 3
  }
]

Do not include any other text, explanations, or markdown formatting.`;

    const response = await fetch("https://api.you.com/v1/agents/runs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent: "advanced",
        input: prompt,
        stream: false,
        verbosity: "medium"
      }),
    });

    if (!response.ok) {
      throw new Error(`You.com Agent API error: ${response.status}`);
    }

    const data = await response.json();
    const validated = YouAgentResponseSchema.parse(data);
    
    // Extract the text response and try to parse as JSON
    const responseText = validated.output?.[0]?.text || "";
    
    try {
      // Try to extract JSON from the response text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const cards = JSON.parse(jsonMatch[0]);
        return cards.map((card: any) => ({
          front: card.front || "",
          back: card.back || "",
          codeSnippet: card.codeSnippet,
          difficulty: card.difficulty || 3,
        }));
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from agent response:", parseError);
    }
    
    // Fallback: return empty array if parsing fails
    return [];
  } catch (error) {
    console.error("Agent API error:", error);
    return [];
  }
}



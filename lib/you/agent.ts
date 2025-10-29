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
    type: z.string().optional(),
    text: z.string().optional(),
    content: z.string().optional(),
    agent: z.string().optional(),
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
    const systemPrompt = `You are a flashcard generator. You MUST respond with ONLY a valid JSON array. No explanations, no markdown formatting, no text before or after the JSON.`;
    
    const prompt = `Create 5-10 flashcards about: ${args.topic}

${args.summary ? `Context: ${args.summary}` : ''}

Return as a JSON array with this structure:
[{"front":"question","back":"answer","difficulty":3}]

Rules:
- front: short question or term
- back: clear answer (max 2 sentences)
- difficulty: number 1-5
- Only add codeSnippet field if topic is programming-related`;

    const response = await fetch("https://api.you.com/v1/agents/runs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent: "advanced",
        input: `${systemPrompt}\n\n${prompt}`,
        stream: false,
        verbosity: "medium",
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("You.com API Error:", response.status, errorData);
      throw new Error(`You.com Agent API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("You.com API Response:", JSON.stringify(data, null, 2));
    const validated = YouAgentResponseSchema.parse(data);
    
    // Extract the text response and try to parse as JSON
    const responseText = validated.output?.[0]?.text || validated.output?.[0]?.content || "";
    console.log("Response Text:", responseText);
    
    try {
      // Try multiple JSON extraction methods
      let jsonString = responseText;
      
      // Method 1: Extract JSON from code blocks
      const codeBlockMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1];
      } else {
        // Method 2: Find the largest valid JSON array
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }
      }
      
      // Clean up common JSON formatting issues
      jsonString = jsonString
        .replace(/\\n/g, ' ')  // Remove newlines in strings
        .replace(/\n/g, ' ')   // Remove actual newlines
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .replace(/"\s+(\d+)\s*}/g, '", "difficulty": $1 }')  // Fix missing difficulty field
        .replace(/}"\s+(\d+)/g, '}", "difficulty": $1')  // Another pattern for missing difficulty
        .trim();
      
      // Handle truncated JSON - find the last valid complete object
      // Look for pattern: } followed by comma and another object
      const objectPattern = /\}\s*,\s*\{/g;
      const matches = [...jsonString.matchAll(objectPattern)];
      
      if (matches.length > 0 && !jsonString.trim().endsWith('}]')) {
        // Get position of last complete object separator
        const lastMatch = matches[matches.length - 1];
        const cutoffIndex = lastMatch.index! + 1; // Keep the closing brace
        jsonString = jsonString.substring(0, cutoffIndex) + ' ]';
      } else if (!jsonString.endsWith(']')) {
        // Fallback: just add closing bracket
        const lastBrace = jsonString.lastIndexOf('}');
        if (lastBrace > 0) {
          jsonString = jsonString.substring(0, lastBrace + 1) + ']';
        }
      }
      
      console.log("Cleaned JSON:", jsonString.substring(0, 300) + "...");
      
      const cards = JSON.parse(jsonString);
      
      if (!Array.isArray(cards)) {
        throw new Error("Response is not an array");
      }
      
      // Filter out invalid cards and map to our format
      const validCards = cards
        .filter((card: any) => card.front && card.back)
        .map((card: any) => ({
          front: card.front,
          back: card.back,
          codeSnippet: card.codeSnippet || undefined,
          difficulty: card.difficulty || 3,
        }));
      
      if (validCards.length === 0) {
        throw new Error("No valid flashcards generated");
      }
      
      return validCards;
    } catch (parseError) {
      console.error("Failed to parse JSON from agent response:", parseError);
      console.error("Full response text:", responseText);
      throw new Error("Failed to parse flashcards from AI response. Please try again.");
    }
  } catch (error) {
    console.error("Agent API error:", error);
    return [];
  }
}



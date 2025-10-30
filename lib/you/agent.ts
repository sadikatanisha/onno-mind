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
    const systemPrompt = `You are an expert flashcard generator. Output ONLY valid JSON arrays.

RULES:
- Return ONLY a JSON array, nothing else
- Each object must have: front, back, difficulty
- Optionally add codeSnippet for programming topics
- No markdown, no explanations, no text outside JSON
- Ensure proper JSON escaping`;

    const prompt = `Create 5-10 educational flashcards about: ${args.topic}

${args.summary ? `Context: ${args.summary}` : ''}

Output format:
[{"front":"question","back":"answer","difficulty":3,"codeSnippet":"optional"}]

Requirements:
- front: Clear question (short)
- back: Concise answer (1-2 sentences max)
- difficulty: 1-5 (1=easy, 5=expert)
- codeSnippet: Only for programming topics`;

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
        verbosity: "medium"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("You.com API Error:", response.status, errorData);
      
      // Handle specific error cases
      if (response.status === 402) {
        throw new Error("No API credits available. Please add credits at https://you.com/billing");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment or add more credits at https://you.com/billing");
      }
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your YOU_API_KEY configuration");
      }
      if (response.status === 404) {
        throw new Error("Custom agent not found. Please verify YOUR_CUSTOM_AGENT_ID is correct at https://you.com/agents");
      }
      
      throw new Error(`You.com API error (${response.status}): ${errorData.error || errorData.message || 'Unknown error'}`);
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



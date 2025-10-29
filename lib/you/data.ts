import { z } from "zod";
import type { NormalizedSource } from "./search";

const YouDataResponseSchema = z.object({
  output: z.array(z.object({
    type: z.string(),
    text: z.string(),
    content: z.string().optional(),
    agent: z.string(),
  }))
});

export async function summarizeSources(sources: NormalizedSource[]): Promise<{
  summary: string
  citations: Record<number, string>
}> {
  if (!process.env.YOU_API_KEY) {
    throw new Error("YOU_API_KEY not configured");
  }

  try {
    // Use You.com Advanced Agent API for summarization
    const response = await fetch("https://api.you.com/v1/agents/runs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent: "advanced",
        input: `Summarize the following sources into bullet points for creating flashcards:

${sources.map((s, i) => `${i + 1}. ${s.title} (${s.url})\n   ${s.snippet || 'No snippet available'}`).join('\n\n')}

Provide a comprehensive summary with key facts and concepts that would be useful for creating educational flashcards.`,
        stream: false,
        verbosity: "medium"
      }),
    });

    if (!response.ok) {
      throw new Error(`You.com Agent API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract summary from agent response
    const summary = data.output?.[0]?.text || "";
    
    return {
      summary,
      citations: {}, // You.com doesn't provide citation mapping in this format
    };
  } catch (error) {
    console.error("Data API error:", error);
    return { summary: "", citations: {} };
  }
}



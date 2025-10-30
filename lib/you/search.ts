import { z } from "zod";
import type { Source } from "@prisma/client";

export type NormalizedSource = Pick<Source, "url" | "title" | "snippet" | "provider"> & {
  metadata?: Record<string, unknown>
}

const YouSearchResponseSchema = z.object({
  hits: z.array(z.object({
    url: z.string(),
    title: z.string(),
    snippet: z.string().optional(),
    provider: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }))
});

export async function searchWeb(query: string): Promise<NormalizedSource[]> {
  if (!process.env.YOU_API_KEY) {
    throw new Error("YOU_API_KEY not configured");
  }

  try {
    const response = await fetch("https://api.you.com/search", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      // You.com Search API uses query parameters
    });

    if (!response.ok) {
      throw new Error(`You.com Search API error: ${response.status}`);
    }

    const data = await response.json();
    const validated = YouSearchResponseSchema.parse(data);
    
    return validated.hits.map(hit => ({
      url: hit.url,
      title: hit.title,
      snippet: hit.snippet ?? null,
      provider: hit.provider ?? null,
      metadata: hit.metadata,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}



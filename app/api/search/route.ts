import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import  prisma  from "@/lib/prisma";
import { searchWeb } from "@/lib/you/search";
import { summarizeSources } from "@/lib/you/data";

const BodySchema = z.object({ topic: z.string().min(2).max(200) });

export async function POST(req: Request) {
  try {
    const userId = await requireAuth();
    const json = await req.json();
    const { topic } = BodySchema.parse(json);

    const sources = await searchWeb(topic);
    const { summary } = await summarizeSources(sources);

    const deck = await prisma.deck.create({
      data: {
        userId,
        title: topic,
        topic,
        sources: {
          create: sources.map((s) => ({
            url: s.url,
            title: s.title,
            snippet: s.snippet ?? null,
            provider: s.provider ?? null,
            metadataJson: s.metadata ? (s.metadata as any) : undefined,
          })),
        },
      },
      include: { sources: true },
    });

    return NextResponse.json({ deckId: deck.id, sources: deck.sources, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}



import { NextResponse } from "next/server";
import { z } from "zod";
import  prisma  from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateFlashcards } from "@/lib/you/agent";

const BodySchema = z.object({ deckId: z.string().cuid() });

export async function POST(req: Request) {
  try {
    const userId = await requireAuth();
    const json = await req.json();
    const { deckId } = BodySchema.parse(json);

    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: { sources: true },
    });
    if (!deck || deck.userId !== userId) throw new Error("Not found");

    const cards = await generateFlashcards({ topic: deck.title, sources: deck.sources as any });
    return NextResponse.json({ cards });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}



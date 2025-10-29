import { NextResponse } from "next/server";
import { z } from "zod";
import  prisma  from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const ParamsSchema = z.object({ deckId: z.string().cuid().optional() });

export async function GET(req: Request) {
  try {
    const userId = await requireAuth();
    const { searchParams } = new URL(req.url);
    const { deckId } = ParamsSchema.parse(Object.fromEntries(searchParams));

    const deckFilter = deckId ? { id: deckId, userId } : { userId };

    const decks = await prisma.deck.findMany({ where: deckFilter, select: { id: true } });
    const deckIds = decks.map((d) => d.id);

    const [totalCards, dueToday] = await Promise.all([
      prisma.card.count({ where: { deckId: { in: deckIds } } }),
      prisma.schedule.count({ where: { deckId: { in: deckIds }, userId, dueAt: { lte: new Date() } } }),
    ]);

    return NextResponse.json({ totalCards, dueToday });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}



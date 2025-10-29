import { NextResponse } from "next/server";
import { z } from "zod";
import  prisma  from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const CardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  codeSnippet: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
});

const BodySchema = z.object({
  deckId: z.string().cuid(),
  cards: z.array(CardSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const userId = await requireAuth();
    const json = await req.json();
    const { deckId, cards } = BodySchema.parse(json);

    const deck = await prisma.deck.findUnique({ where: { id: deckId } });
    if (!deck || deck.userId !== userId) {
      throw new Error("Not found");
    }

    const created = await prisma.$transaction(async (tx: typeof prisma) => {
      const cardRows = await Promise.all(
        cards.map((c) =>
          tx.card.create({
            data: {
              deckId,
              front: c.front,
              back: c.back,
              codeSnippet: c.codeSnippet ?? null,
              difficulty: c.difficulty ?? null,
            },
          })
        )
      );
      await Promise.all(
        cardRows.map((card) =>
          tx.schedule.create({
            data: {
              cardId: card.id,
              userId,
              deckId,
              dueAt: new Date(),
              interval: 0,
              ease: 2.5,
              reps: 0,
              lapses: 0,
            },
          })
        )
      );
      return cardRows;
    });

    return NextResponse.json({ cards: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}



import { NextResponse } from "next/server";
import { z } from "zod";
import prisma  from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateSm2 } from "@/lib/sm2";

const BodySchema = z.object({
  deckId: z.string().cuid(),
  cardId: z.string().cuid(),
  quality: z.number().int().min(0).max(5),
  elapsedMs: z.number().int().min(0),
});

export async function POST(req: Request) {
  try {
    const userId = await requireAuth();
    const json = await req.json();
    const { deckId, cardId, quality, elapsedMs } = BodySchema.parse(json);

    const schedule = await prisma.schedule.findUnique({ where: { cardId } });
    if (!schedule || schedule.userId !== userId || schedule.deckId !== deckId) throw new Error("Not found");

    const { ease, interval, reps, nextDue } = updateSm2({
      quality: quality as 0 | 1 | 2 | 3 | 4 | 5,
      prevEase: schedule.ease,
      prevInterval: schedule.interval,
      prevReps: schedule.reps,
    });

    const [, updated] = await prisma.$transaction([
      prisma.review.create({
        data: {
          cardId,
          userId,
          rating: quality,
          elapsedMs,
        },
      }),
      prisma.schedule.update({
        where: { cardId },
        data: { ease, interval, reps, dueAt: nextDue },
      }),
    ]);

    const nextCard = await prisma.card.findFirst({
      where: {
        deckId,
        schedule: { is: { userId, dueAt: { lte: new Date() } } },
      },
      orderBy: { schedule: { dueAt: "asc" } },
    });

    return NextResponse.json({ schedule: updated, nextCard });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}



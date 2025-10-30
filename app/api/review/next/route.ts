import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get("deckId");

    if (!deckId) {
      return NextResponse.json({ error: "deckId required" }, { status: 400 });
    }

    let card = await prisma.card.findFirst({
      where: {
        deckId,
        schedule: { is: { userId, dueAt: { lte: new Date() } } },
      },
      orderBy: { schedule: { dueAt: "asc" } },
    });

    // If no card found with schedule, create schedules for cards that don't have them
    if (!card) {
      const cardsWithoutSchedule = await prisma.card.findMany({
        where: { deckId, schedule: { is: null } },
      });

      if (cardsWithoutSchedule.length > 0) {
        await prisma.schedule.createMany({
          data: cardsWithoutSchedule.map((c) => ({
            cardId: c.id,
            userId,
            deckId,
            dueAt: new Date(),
            interval: 0,
            ease: 2.5,
            reps: 0,
            lapses: 0,
          })),
        });

        // Fetch again after creating schedules
        card = await prisma.card.findFirst({
          where: {
            deckId,
            schedule: { is: { userId, dueAt: { lte: new Date() } } },
          },
          orderBy: { schedule: { dueAt: "asc" } },
        });
      }
    }

    return NextResponse.json({ card });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}

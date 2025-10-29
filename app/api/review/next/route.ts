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

    const card = await prisma.card.findFirst({
      where: {
        deckId,
        schedule: { is: { userId, dueAt: { lte: new Date() } } },
      },
      orderBy: { schedule: { dueAt: "asc" } },
    });

    return NextResponse.json({ card });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}

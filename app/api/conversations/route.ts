import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ConversationMode } from "@/lib/types/conversation";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { topic, mode, deckId } = body as {
    topic?: string;
    mode?: ConversationMode;
    deckId?: string;
  };

  const conversation = await prisma.conversation.create({
    data: {
      userId,
      topic,
      mode: mode || "chat",
      deckId,
    },
  });

  return NextResponse.json(conversation);
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") as ConversationMode | null;
  const limit = parseInt(searchParams.get("limit") || "20");
  const deckId = searchParams.get("deckId");
  const active = searchParams.get("active") === "true";

  const conversations = await prisma.conversation.findMany({
    where: {
      userId,
      ...(mode && { mode }),
      ...(deckId && { deckId }),
      ...(active && { quizCompleted: false }),
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  return NextResponse.json(conversations);
}

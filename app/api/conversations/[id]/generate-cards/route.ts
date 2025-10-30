import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateFlashcards } from "@/lib/you/agent";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { deckTitle, sources } = body as { 
    deckTitle?: string;
    sources?: Array<{ url: string; title: string }>;
  };

  const conversation = await prisma.conversation.findUnique({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const conversationSummary = conversation.messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const topic = conversation.topic || "Conversation";

  const draftCards = await generateFlashcards({
    topic,
    summary: conversationSummary,
  });

  const deck = await prisma.deck.create({
    data: {
      userId,
      title: deckTitle || `Flashcards: ${topic}`,
      topic,
      cardCount: draftCards.length,
      cards: {
        create: draftCards.map((card, idx) => ({
          front: card.front,
          back: card.back,
          codeSnippet: card.codeSnippet,
          difficulty: card.difficulty,
          order: idx,
        })),
      },
      sources: sources && sources.length > 0 ? {
        create: sources.map(source => ({
          url: source.url,
          title: source.title,
          snippet: null,
          provider: new URL(source.url).hostname,
        })),
      } : undefined,
    },
    include: {
      cards: true,
      sources: true,
    },
  });

  // Create schedules with dueAt in the past so cards are immediately available
  const now = new Date();
  await Promise.all(
    deck.cards.map((card) =>
      prisma.schedule.create({
        data: {
          cardId: card.id,
          userId,
          deckId: deck.id,
          dueAt: new Date(now.getTime() - 1000), // 1 second in the past
        },
      })
    )
  );

  await prisma.conversation.update({
    where: { id },
    data: {
      deckId: deck.id,
      summary: conversationSummary,
    },
  });

  return NextResponse.json({
    deckId: deck.id,
    cardCount: deck.cards.length,
  });
}

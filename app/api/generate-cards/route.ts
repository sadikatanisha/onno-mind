import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { generateFlashcards } from "@/lib/you/agent";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, conversationSummary, deckTitle } = await req.json();

  try {
    const cards = await generateFlashcards({
      topic,
      summary: conversationSummary,
    });

    if (cards.length === 0) {
      return Response.json({ error: "Failed to generate cards" }, { status: 500 });
    }

    // Create deck in database
    const deck = await prisma.deck.create({
      data: {
        userId,
        title: deckTitle || `${topic} Flashcards`,
        description: `Generated from conversation about ${topic}`,
        cardCount: cards.length,
      },
    });

    // Create cards in database
    await prisma.card.createMany({
      data: cards.map((card, index) => ({
        deckId: deck.id,
        front: card.front,
        back: card.back,
        codeSnippet: card.codeSnippet,
        difficulty: card.difficulty || 3,
        order: index,
      })),
    });

    return Response.json({ deckId: deck.id, cardCount: cards.length });
  } catch (error: any) {
    console.error("Generate cards error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

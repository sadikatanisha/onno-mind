import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { DeckCard } from "@/components/decks/deck-card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

export default async function DecksPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const decks = await prisma.deck.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      cards: {
        include: {
          schedule: true,
        },
      },
      conversations: {
        where: { mode: "quiz" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const totalCards = decks.reduce((sum, deck) => sum + (deck.cardCount || 0), 0);

  return (
    <div className="h-full overflow-auto bg-slate-950 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Decks</h1>
            <p className="text-sm text-gray-400">
              {decks.length} decks • {totalCards} cards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              New Deck
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      </div>
    </div>
  );
}

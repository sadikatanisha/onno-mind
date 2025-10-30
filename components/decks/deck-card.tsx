"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, CheckCircle, Brain, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Card, Schedule, Conversation } from "@prisma/client";

interface DeckCardProps {
  deck: {
    id: string;
    title: string;
    description?: string | null;
    topic?: string | null;
    createdAt: Date;
    cardCount?: number | null;
    cards: (Card & { schedule: Schedule | null })[];
    conversations: Conversation[];
  };
}

export function DeckCard({ deck }: DeckCardProps) {
  const totalCards = deck.cards.length;
  const now = new Date();
  
  // Calculate due cards (cards with schedule date in the past)
  const dueCards = deck.cards.filter(card => 
    card.schedule && new Date(card.schedule.dueAt) <= now
  ).length;
  
  // Calculate new cards (cards without schedule)
  const newCards = deck.cards.filter(card => !card.schedule).length;
  
  // Get last quiz attempt
  const lastQuiz = deck.conversations[0];

  const getIcon = (index: number) => {
    const icons = [BarChart3, FileText, CheckCircle];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const Icon = getIcon(deck.title.length);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition-colors hover:border-slate-700">
      <div className="flex items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800/50">
          <Icon className="h-8 w-8 text-purple-400" />
        </div>

        <div className="flex-1">
          <Link href={`/decks/${deck.id}`}>
            <h3 className="mb-2 text-xl font-semibold text-white hover:text-purple-400 transition-colors">
              {deck.title}
            </h3>
          </Link>
          {deck.description && (
            <p className="text-sm text-gray-400 mb-2">{deck.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {deck.topic && (
              <span className="rounded-md bg-purple-900/30 px-3 py-1 text-xs text-purple-300">
                {deck.topic}
              </span>
            )}
            {lastQuiz && (
              <span className="flex items-center gap-1 text-xs text-blue-400">
                <Brain className="h-3 w-3" />
                Last quiz: {lastQuiz.quizScore || 0}/{lastQuiz.quizTotal || 0}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{dueCards}</div>
              <div className="text-xs text-gray-400">Due</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{newCards}</div>
              <div className="text-xs text-gray-400">New</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalCards}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href={`/decks/${deck.id}`}>
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">
                <Eye className="h-4 w-4 mr-1" />
                View Cards
              </Button>
            </Link>
            <Link href={`/review/${deck.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                📚 Review
              </Button>
            </Link>
            <Link href={`/quiz/${deck.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <Brain className="h-4 w-4 mr-1" />
                Quiz
              </Button>
            </Link>
            <span className="text-xs text-gray-500 text-center mt-1">
              {formatDistanceToNow(new Date(deck.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

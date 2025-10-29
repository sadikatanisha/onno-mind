"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DeckCardProps {
  deck: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    cardCount?: number | null;
  };
}

export function DeckCard({ deck }: DeckCardProps) {
  const dueCards = Math.floor(Math.random() * 10);
  const newCards = Math.floor(Math.random() * 15);
  const totalCards = deck.cardCount || 0;
  const progress = totalCards > 0 ? Math.floor(((totalCards - newCards) / totalCards) * 100) : 0;

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
          <h3 className="mb-2 text-xl font-semibold text-white">{deck.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              From document.pdf
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            {["Tag 1", "Tag 2", "Tag 3"].map((tag, i) => (
              <span
                key={i}
                className="rounded-md bg-purple-900/30 px-3 py-1 text-xs text-purple-300"
              >
                {tag}
              </span>
            ))}
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

          <div className="flex flex-col items-center gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Study Now
            </Button>
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-700"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${progress} 100`}
                  className="text-cyan-400"
                />
              </svg>
              <span className="absolute text-sm font-semibold text-cyan-400">{progress}%</span>
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(deck.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

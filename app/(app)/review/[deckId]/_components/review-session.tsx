"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReviewCard } from "@/components/review/review-card";
import { RatingButtons } from "@/components/review/rating-buttons";
import { ReviewStats } from "@/components/review/review-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ReviewSessionProps {
  deckId: string;
}

export function ReviewSession({ deckId }: ReviewSessionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "due";
  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchNext = async () => {
    try {
      setLoading(true);
      const statsRes = await fetch(`/api/stats?deckId=${deckId}`);
      const stats = await statsRes.json();
      setTotal(mode === "all" ? stats.total || 0 : stats.dueToday || 0);
      
      const cardRes = await fetch(`/api/review/next?deckId=${deckId}&mode=${mode}`);
      const cardData = await cardRes.json();
      setCard(cardData.card || null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNext();
  }, [mode]);

  const submitRating = async (quality: number) => {
    if (!card) return;
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId, cardId: card.id, quality, elapsedMs: 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setCard(data.nextCard);
      setIsFlipped(false);
      setCompleted((prev) => prev + 1);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="h-full overflow-auto bg-slate-950 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/decks")}
            className="text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
          <ReviewStats completed={completed} total={total || 10} />
        </div>
        
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-[150px]" />
              ))}
            </div>
          </div>
        )}

        {!card && !loading && (
          <div className="text-center py-12 space-y-4">
            <p className="text-xl text-muted-foreground">No cards due for review</p>
            <p className="text-sm text-muted-foreground">Great job! Come back later.</p>
            <button
              onClick={() => window.location.href = `/review/${deckId}?mode=all`}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Review All Cards Anyway
            </button>
          </div>
        )}

        {card && !loading && (
          <div className="space-y-6">
            <ReviewCard
              front={card.front}
              back={card.back}
              codeSnippet={card.codeSnippet}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
            {isFlipped && <RatingButtons onRate={submitRating} />}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReviewCard } from "@/components/review/review-card";
import { RatingButtons } from "@/components/review/rating-buttons";
import { ReviewStats } from "@/components/review/review-stats";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewPage({ params }: { params: { deckId: string } }) {
  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchNext = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stats?deckId=${params.deckId}`);
      await res.json();
      setCard(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNext();
  }, []);

  const submitRating = async (quality: number) => {
    if (!card) return;
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        body: JSON.stringify({ deckId: params.deckId, cardId: card.id, quality, elapsedMs: 0 }),
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
    <div className="max-w-3xl mx-auto space-y-6">
      <ReviewStats completed={completed} total={total || 10} />
      
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
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No cards due for review</p>
          <p className="text-sm text-muted-foreground mt-2">Great job! Come back later.</p>
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
  );
}



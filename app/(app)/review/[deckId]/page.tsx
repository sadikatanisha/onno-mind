import { Suspense } from "react";
import { ReviewSession } from "./_components/review-session";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ReviewPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;

  return (
    <Suspense fallback={
      <div className="h-full overflow-auto bg-slate-950 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    }>
      <ReviewSession deckId={deckId} />
    </Suspense>
  );
}



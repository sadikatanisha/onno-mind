"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReviewStatsProps {
  completed: number;
  total: number;
  deckTitle?: string;
}

export function ReviewStats({ completed, total, deckTitle }: ReviewStatsProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{deckTitle || "Review Session"}</h2>
          <span className="text-sm text-muted-foreground">
            {completed} / {total}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </Card>
  );
}

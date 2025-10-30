"use client";

import { Card } from "@/components/ui/card";

interface ReviewCardProps {
  front: string;
  back: string;
  codeSnippet?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function ReviewCard({ front, back, codeSnippet, isFlipped, onFlip }: ReviewCardProps) {
  return (
    <Card className="p-8 min-h-[300px] flex flex-col justify-center items-center cursor-pointer transition-all hover:border-accent overflow-hidden" onClick={onFlip}>
      <div className="text-center space-y-4 w-full max-w-full">
        <div className="text-xl font-semibold text-foreground break-words">{front}</div>
        {isFlipped && (
          <>
            <div className="border-t border-border pt-4 mt-4" />
            <div className="text-base text-muted-foreground break-words">{back}</div>
            {codeSnippet && (
              <pre className="bg-muted p-4 rounded-lg text-sm text-left overflow-x-auto max-w-full">
                <code className="break-words whitespace-pre-wrap">{codeSnippet}</code>
              </pre>
            )}
          </>
        )}
        {!isFlipped && (
          <div className="text-sm text-muted-foreground mt-4">Click to reveal answer</div>
        )}
      </div>
    </Card>
  );
}

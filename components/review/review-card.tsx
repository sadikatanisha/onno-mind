"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  front: string;
  back: string;
  codeSnippet?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function ReviewCard({ front, back, codeSnippet, isFlipped, onFlip }: ReviewCardProps) {
  return (
    <Card className="p-8 min-h-[400px] flex flex-col justify-between items-center overflow-hidden">
      <div className="text-center space-y-6 w-full max-w-full flex-1 flex flex-col justify-center">
        <div className="text-2xl font-semibold text-foreground break-words">{front}</div>
        {isFlipped && (
          <>
            <div className="border-t border-border pt-6 mt-6" />
            <div className="text-lg text-muted-foreground break-words">{back}</div>
            {codeSnippet && (
              <pre className="bg-muted p-4 rounded-lg text-sm text-left overflow-x-auto max-w-full">
                <code className="break-words whitespace-pre-wrap">{codeSnippet}</code>
              </pre>
            )}
          </>
        )}
      </div>
      {!isFlipped && (
        <Button 
          onClick={onFlip}
          size="lg"
          className="mt-6 bg-purple-600 hover:bg-purple-700 w-full max-w-xs"
        >
          Show Answer
        </Button>
      )}
    </Card>
  );
}

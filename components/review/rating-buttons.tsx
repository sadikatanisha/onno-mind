"use client";

import { Button } from "@/components/ui/button";

interface RatingButtonsProps {
  onRate: (quality: number) => void;
  disabled?: boolean;
}

const ratings = [
  { value: 1, label: "Again", variant: "destructive" as const },
  { value: 2, label: "Hard", variant: "secondary" as const },
  { value: 3, label: "Good", variant: "outline" as const },
  { value: 4, label: "Easy", variant: "default" as const },
];

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div className="flex gap-3 justify-center w-full">
      {ratings.map((rating) => (
        <Button
          key={rating.value}
          variant={rating.variant}
          size="lg"
          onClick={() => onRate(rating.value)}
          disabled={disabled}
          className="flex-1 max-w-[150px]"
        >
          {rating.label}
        </Button>
      ))}
    </div>
  );
}

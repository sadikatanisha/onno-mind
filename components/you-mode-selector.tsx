"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type YouAPIMode = "search" | "smart" | "advanced";

interface YouModeSelectorProps {
  value: YouAPIMode;
  onChange: (mode: YouAPIMode) => void;
}

export function YouModeSelector({ value, onChange }: YouModeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">You.com Mode:</span>
      <Select value={value} onValueChange={(v) => onChange(v as YouAPIMode)}>
        <SelectTrigger className="w-[200px] h-8 text-xs bg-slate-800 border-slate-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          <SelectItem value="advanced" className="text-xs">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-purple-400" />
              Advanced Agent (AI Chat)
            </div>
          </SelectItem>
          <SelectItem value="smart" className="text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Smart Assistant (Legacy)
            </div>
          </SelectItem>
          <SelectItem value="search" className="text-xs">
            <div className="flex items-center gap-2">
              <Search className="h-3 w-3 text-slate-400" />
              Search (Raw Results)
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Hook to manage You.com API mode with localStorage persistence
 */
export function useYouAPIMode() {
  const [mode, setMode] = useState<YouAPIMode>("advanced");

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("you-api-mode");
    if (saved === "search" || saved === "smart" || saved === "advanced") {
      setMode(saved);
    }
  }, []);

  const updateMode = (newMode: YouAPIMode) => {
    setMode(newMode);
    localStorage.setItem("you-api-mode", newMode);
  };

  return [mode, updateMode] as const;
}

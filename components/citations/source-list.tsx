"use client";

import { Globe } from "lucide-react";
import { CitationCard } from "./citation-card";
import type { YouSearchResult } from "@/lib/you-api";

interface SourceListProps {
  sources: YouSearchResult[];
  title?: string;
  maxDisplay?: number;
}

export function SourceList({ sources, title = "Sources", maxDisplay }: SourceListProps) {
  const displaySources = maxDisplay ? sources.slice(0, maxDisplay) : sources;

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-300">
          {title} ({sources.length})
        </h3>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      <div className="space-y-2">
        {displaySources.map((source, idx) => (
          <CitationCard 
            key={source.url} 
            source={source} 
            index={idx + 1}
          />
        ))}
      </div>

      {maxDisplay && sources.length > maxDisplay && (
        <p className="text-xs text-slate-500 text-center">
          +{sources.length - maxDisplay} more sources
        </p>
      )}
    </div>
  );
}

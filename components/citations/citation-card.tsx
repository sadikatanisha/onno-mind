"use client";

import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTimeSince, getSourceFreshness } from "@/lib/you-api";
import type { YouSearchResult } from "@/lib/you-api";

interface CitationCardProps {
  source: YouSearchResult;
  index?: number;
  showSnippet?: boolean;
}

export function CitationCard({ source, index, showSnippet = true }: CitationCardProps) {
  const freshness = getSourceFreshness(source.page_age);
  const timeSince = getTimeSince(source.page_age);

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Thumbnail */}
          {source.thumbnail_url && (
            <img
              src={source.thumbnail_url}
              alt={source.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              {source.favicon_url && (
                <img
                  src={source.favicon_url}
                  alt=""
                  className="w-4 h-4 mt-1 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-slate-200 hover:text-white line-clamp-2 flex items-center gap-1"
                >
                  {index && (
                    <span className="text-xs text-slate-500 mr-1">[{index}]</span>
                  )}
                  {source.title}
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-2 mb-2">
              {source.description}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge 
                className={`text-xs ${
                  freshness.level === 'high' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : freshness.level === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                }`}
                variant="outline"
              >
                {freshness.badge}
              </Badge>
              <span className="text-xs text-slate-500">
                Updated {timeSince}
              </span>
            </div>

            {/* Snippet */}
            {showSnippet && source.snippets && source.snippets.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400 italic line-clamp-3">
                  "{source.snippets[0]}"
                </p>
              </div>
            )}

            {/* Authors */}
            {source.authors && source.authors.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-slate-500">By:</span>
                <span className="text-xs text-slate-400">
                  {source.authors.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

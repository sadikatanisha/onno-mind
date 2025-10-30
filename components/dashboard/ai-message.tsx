import { Brain, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIMessageProps {
  message: string;
  sources?: Array<{ url: string; title: string }>;
}


export function AIMessage({ message, sources }: AIMessageProps) {
  console.log("AIMessage", message);
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
        <Brain className="h-5 w-5 text-purple-400" />
      </div>
      <div className="flex flex-col gap-2 max-w-3xl">
        <Card className="bg-slate-700/50 border-slate-600 rounded-2xl px-6 py-4">
          <div className="text-slate-200 text-sm leading-relaxed prose prose-invert prose-sm max-w-none
            prose-headings:text-slate-100 prose-headings:font-semibold
            prose-h1:text-lg prose-h1:mb-3 prose-h1:mt-0
            prose-h2:text-base prose-h2:mb-2 prose-h2:mt-4
            prose-h3:text-sm prose-h3:mb-2 prose-h3:mt-3
            prose-p:my-2 prose-p:leading-relaxed
            prose-strong:text-purple-300 prose-strong:font-semibold
            prose-em:text-slate-300
            prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5
            prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5
            prose-li:my-1
            prose-code:text-purple-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-3
            prose-a:text-purple-400 prose-a:underline hover:prose-a:text-purple-300
            prose-blockquote:border-l-purple-500 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400
            prose-hr:border-slate-600 prose-hr:my-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message}
            </ReactMarkdown>
          </div>
        </Card>
        {sources && sources.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 rounded bg-purple-500/20 flex items-center justify-center">
                <ExternalLink className="h-3 w-3 text-purple-400" />
              </div>
              <p className="text-xs font-semibold text-purple-300">📚 Sources from the web:</p>
            </div>
            <div className="space-y-2">
              {sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0 text-purple-400 group-hover:text-purple-300" />
                    <span className="text-xs text-purple-400 group-hover:text-purple-300 line-clamp-2">{source.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

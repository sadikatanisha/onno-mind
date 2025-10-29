"use client";

import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function ChatInput({ onSend, suggestions, placeholder = "Ask anything about your decks..." }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-b border-slate-700 bg-slate-900/50 p-4 space-y-3">
      {suggestions && suggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {suggestions.map((suggestion, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => setMessage(suggestion)}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[44px] max-h-32 resize-none bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 pr-12"
            rows={1}
          />
        </div>

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-10 w-10 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

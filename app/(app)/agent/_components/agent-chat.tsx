"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMessage } from "@/components/dashboard/user-message";
import { AIMessage } from "@/components/dashboard/ai-message";
import { ChatInput } from "@/components/dashboard/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  sources?: Array<{ url: string; title: string }>;
}

interface AgentChatProps {
  deckTitle: string;
  userImage?: string;
  userName?: string;
}

export function AgentChat({ deckTitle, userImage, userName }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hello! I'm your AI assistant. I can help you:\n\n• Create flashcard decks on any topic\n• Search and summarize information\n• Generate practice cards\n• Review your decks with spaced repetition\n• Track your learning progress\n\nWhat would you like to learn today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(m => ({ role: m.type === "user" ? "user" : "assistant", content: m.content }))
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.message,
        sources: data.sources || [],
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  const handleGenerateCards = async () => {
    setLoading(true);
    try {
      const conversationText = messages
        .filter(m => m.type === "user" || m.type === "ai")
        .map(m => m.content)
        .join("\n\n");

      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: deckTitle,
          conversationSummary: conversationText,
          deckTitle: `${deckTitle} - Flashcards`,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cards");
      }

      toast.success(`Generated ${data.cardCount} flashcards!`);
      window.location.href = `/decks/${data.deckId}`;
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Create a deck about JavaScript",
    "Generate cards from my notes",
    "Show my learning stats"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-700 p-4 flex items-center justify-between bg-slate-900/30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-200">{deckTitle}</h1>
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <Pencil className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300">
              GPT-4
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>GPT-4</DropdownMenuItem>
            <DropdownMenuItem>GPT-3.5</DropdownMenuItem>
            <DropdownMenuItem>Claude</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChatInput onSend={handleSendMessage} suggestions={suggestions} />
      
      {messages.length > 2 && (
        <div className="p-3 bg-slate-900/50 flex items-center justify-center border-b border-slate-700">
          <Button
            onClick={handleGenerateCards}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Generate Flashcards from Conversation
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === "user" ? (
                  <UserMessage message={msg.content} userImage={userImage} userName={userName} />
                ) : (
                  <AIMessage message={msg.content} sources={msg.sources} />
                )}
                {msg.type === "ai" && (
                  <div className="text-xs text-slate-500 mt-1 ml-12">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <div className="animate-pulse h-5 w-5 bg-purple-400 rounded" />
                </div>
                <div className="bg-slate-700/50 border border-slate-600 rounded-2xl px-6 py-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

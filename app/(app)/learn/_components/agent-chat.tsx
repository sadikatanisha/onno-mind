"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMessage } from "@/components/dashboard/user-message";
import { AIMessage } from "@/components/dashboard/ai-message";
import { ChatInput } from "@/components/dashboard/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { YouModeSelector, useYouAPIMode } from "@/components/you-mode-selector";
import type { YouAPIMode } from "@/app/api/chat/route";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlConversationId = searchParams.get("conversationId");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hey! 👋 I'm your AI learning assistant with **real-time web access**.\n\nI can:\n\n• 🌐 **Search the web** for the latest information on any topic\n• 📚 **Create flashcards** from our conversation with source citations\n• 🧠 **Quiz you** with an AI tutor\n• 📊 **Track your progress** with spaced repetition\n\n**Try asking:** \"Teach me about React hooks\" or \"What's new in TypeScript 5.6?\"\n\nWhat would you like to learn today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [generatedDeckId, setGeneratedDeckId] = useState<string | null>(null);
  const [topic, setTopic] = useState("New Chat");
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editedTopic, setEditedTopic] = useState("");
  const [collectedSources, setCollectedSources] = useState<Array<{ url: string; title: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [youMode, setYouMode] = useYouAPIMode();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const loadConversation = async (id: string) => {
      try {
        const convRes = await fetch(`/api/conversations/${id}`);
        const conv = await convRes.json();
        
        if (conv.error) {
          throw new Error(conv.error);
        }

        setConversationId(conv.id);
        setTopic(conv.topic || "New Chat");
        setGeneratedDeckId(conv.deckId);

        if (conv.messages && conv.messages.length > 0) {
          setMessages([
            messages[0],
            ...conv.messages.map((m: any) => ({
              id: m.id,
              type: m.role === "user" ? "user" : "ai",
              content: m.content,
            })),
          ]);
        }
      } catch (e) {
        console.error("Failed to load conversation:", e);
        toast.error("Failed to load conversation");
      }
    };

    const getOrCreateConversation = async () => {
      try {
        // If URL has conversationId, load that specific conversation
        if (urlConversationId) {
          await loadConversation(urlConversationId);
          return;
        }

        // Otherwise, try to get recent active conversation
        const listRes = await fetch("/api/conversations?mode=chat&limit=1");
        const conversations = await listRes.json();
        
        if (conversations.length > 0) {
          const recent = conversations[0];
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          if (new Date(recent.updatedAt) > oneHourAgo) {
            await loadConversation(recent.id);
            return;
          }
        }
        
        // Otherwise, create new conversation
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: deckTitle,
            mode: "chat",
          }),
        });
        const data = await response.json();
        setConversationId(data.id);
        if (data.topic) {
          setTopic(data.topic);
        }
      } catch (e) {
        console.error("Failed to get/create conversation:", e);
      }
    };
    
    getOrCreateConversation();
  }, [deckTitle, urlConversationId]);

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
          conversationHistory: messages.map(m => ({ role: m.type === "user" ? "user" : "assistant", content: m.content })),
          conversationId,
          mode: "chat",
          youMode: youMode,
          topic: deckTitle,
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
      
      // Collect sources for flashcard generation
      if (data.sources && data.sources.length > 0) {
        setCollectedSources(prev => {
          const newSources = data.sources.filter((s: any) => 
            !prev.some(existing => existing.url === s.url)
          );
          return [...prev, ...newSources];
        });
      }
      
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    } catch (e: any) {
      console.error('Chat error:', e);
      
      // Show graceful error in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `**Unable to process your request** 🛠️\n\n${e.message}\n\n**Try this:**\n- Switch You.com mode using the dropdown above\n- Rephrase your question\n- Contact api@you.com for API access support`,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Request failed - see chat for details", { duration: 3000 });
      setLoading(false);
    }
  };

  const handleGenerateCards = async () => {
    if (!conversationId) {
      toast.error("No conversation to generate cards from");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/generate-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckTitle: `${topic} - Flashcards`,
          sources: collectedSources,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.needsCredits) {
          toast.error(data.error, {
            description: "Add credits at you.com/billing to continue",
            duration: 5000,
          });
        } else {
          throw new Error(data.error || "Failed to generate cards");
        }
        return;
      }

      toast.success(`Generated ${data.cardCount} flashcards!`);
      setGeneratedDeckId(data.deckId);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTopic = async () => {
    if (!conversationId || !editedTopic.trim()) {
      setIsEditingTopic(false);
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: editedTopic }),
      });

      if (response.ok) {
        setTopic(editedTopic);
        setIsEditingTopic(false);
        toast.success("Topic updated");
      }
    } catch (e) {
      toast.error("Failed to update topic");
    }
  };

  const suggestions = [
    "Create a deck about JavaScript",
    "Generate cards from my notes",
    "Show my learning stats"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="border-b border-slate-700 p-4 bg-slate-900/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {isEditingTopic ? (
              <input
                type="text"
                value={editedTopic}
                onChange={(e) => setEditedTopic(e.target.value)}
                onBlur={handleSaveTopic}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTopic();
                  if (e.key === "Escape") setIsEditingTopic(false);
                }}
                autoFocus
                className="text-lg font-semibold bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            ) : (
              <>
                <h1 className="text-lg font-semibold text-slate-200">{topic}</h1>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => {
                  setEditedTopic(topic);
                  setIsEditingTopic(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 text-slate-400" />
              </Button>
            </>
          )}
          </div>
        </div>
        
        {/* You.com Mode Selector */}
        <YouModeSelector value={youMode} onChange={setYouMode} />
      </div>
      
      {!generatedDeckId && messages.length > 2 && (
        <div className="p-3 bg-slate-900/50 flex items-center justify-center gap-3 border-b border-slate-700 flex-shrink-0">
          {collectedSources.length > 0 && (
            <div className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/30">
              🌐 {collectedSources.length} web source{collectedSources.length !== 1 ? 's' : ''} collected
            </div>
          )}
          <Button
            onClick={handleGenerateCards}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            🎴 Generate Flashcards with Citations
          </Button>
        </div>
      )}

      {generatedDeckId && (
        <div className="p-3 bg-slate-900/50 flex items-center justify-center gap-3 border-b border-slate-700 flex-shrink-0">
          <p className="text-sm text-slate-300">Flashcards created! Choose how to learn:</p>
          <Button
            onClick={() => router.push(`/review/${generatedDeckId}`)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            📚 Review Flashcards
          </Button>
          <Button
            onClick={() => router.push(`/quiz/${generatedDeckId}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🧠 Start AI Quiz
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
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
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl px-6 py-4">
          <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
                <span className="text-xs text-purple-300 animate-pulse">Searching the web...</span>
                </div>
                </div>
              </div>
            )}
          <div ref={scrollRef} />
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-900/50 flex-shrink-0">
        <ChatInput onSend={handleSendMessage} suggestions={suggestions} />
      </div>
    </div>
  );
}

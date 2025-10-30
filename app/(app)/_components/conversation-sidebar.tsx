"use client";

import { Brain, MessageSquare, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Conversation } from "@/lib/types/conversation";

interface ConversationSidebarProps {
  onConversationSelect?: (id: string) => void;
  selectedConvId?: string;
}

export function ConversationSidebar({ onConversationSelect, selectedConvId }: ConversationSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "chat" | "quiz">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const url = filter === "all" 
          ? "/api/conversations" 
          : `/api/conversations?mode=${filter}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [filter]);

  const filteredConversations = conversations.filter(conv => 
    conv.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const handleConversationClick = (conv: Conversation) => {
    if (conv.mode === "quiz" && conv.deckId) {
      // For quiz conversations, go to quiz page
      router.push(`/quiz/${conv.deckId}`);
    } else {
      // For chat conversations, go to learn page with conversation ID
      router.push(`/learn?conversationId=${conv.id}`);
    }
  };

  return (
    <div className="w-56 border-r border-slate-700 bg-slate-900/50 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        
        <Link href="/learn">
          <Button 
            size="sm" 
            className={`w-full justify-start mb-3 ${
              pathname === '/learn' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </Link>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 text-sm h-9"
          />
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFilter("all")}
            className={`flex-1 h-7 text-xs ${
              filter === "all" 
                ? "bg-slate-700 text-slate-200" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFilter("quiz")}
            className={`flex-1 h-7 text-xs ${
              filter === "quiz" 
                ? "bg-slate-700 text-slate-200" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Quizzes
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {loading && (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-slate-500">Loading...</p>
            </div>
          )}
          
          {!loading && filteredConversations.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-slate-500">No conversations yet</p>
              <p className="text-xs text-slate-600 mt-1">Start a new chat to begin</p>
            </div>
          )}
          
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleConversationClick(conv)}
              className={`block w-full text-left px-3 pr-6 py-2.5 rounded-lg transition-colors hover:bg-slate-800 ${
                selectedConvId === conv.id ? "bg-slate-800" : ""
              }`}
            >
              <div className="flex items-start gap-2 overflow-hidden">
                <MessageSquare className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  conv.mode === "quiz" ? "text-blue-400" : "text-purple-400"
                }`} />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p
                    className="text-sm font-medium text-slate-200 truncate max-w-[11rem] pr-6 block"
                    title={conv.topic || "Untitled Conversation"}
                  >
                    {conv.topic || "Untitled Conversation"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      conv.mode === "quiz" 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {conv.mode}
                    </span>
                    <p className="text-xs text-slate-500">
                      {formatTime(conv.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 mb-2">
          {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
        </div>
        {filter !== "all" && (
          <div className="text-xs text-slate-600">
            Filtered by {filter} mode
          </div>
        )}
      </div>
    </div>
  );
}

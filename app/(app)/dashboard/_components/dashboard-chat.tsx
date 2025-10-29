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

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
}

interface DashboardChatProps {
  deckTitle: string;
  userImage?: string;
  userName?: string;
}

export function DashboardChat({ deckTitle, userImage, userName }: DashboardChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: "Can you summarize the key financial metrics from Q3 and highlight any significant trends?",
    },
    {
      id: "2",
      type: "ai",
      content: `Based on the Q3 Financial Report, here are the key metrics and trends: Revenue Growth: Q3 revenue reached $45.2M, representing a 23% YoY increase. This exceeds projections by 8%. Operational Efficiency: Operating expenses decreased by 12% while maintaining service quality, resulting in improved margins. Customer Acquisition: New customer signups increased by 34%, with a notable 45% improvement in enterprise segment. Significant Trends: • Recurring revenue now comprises 78% of total revenue (up from 65% in Q2) • Customer retention rate improved to 94% • Average contract value increased by 18% The data suggests strong momentum heading into Q4, with particular strength in enterprise sales and operational efficiency.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
    };
    setMessages([...messages, newMessage]);
  };

  const suggestions = [
    "Summarize key points",
    "Find action items",
    "Compare Q2 vs Q3"
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

      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === "user" ? (
                  <UserMessage message={msg.content} userImage={userImage} userName={userName} />
                ) : (
                  <AIMessage message={msg.content} />
                )}
                {msg.type === "ai" && (
                  <div className="text-xs text-slate-500 mt-1 ml-12">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

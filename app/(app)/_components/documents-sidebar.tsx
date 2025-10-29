"use client";

import { Brain, FileText, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Document {
  id: string;
  title: string;
  size: string;
  time: string;
}

interface DocumentsSidebarProps {
  documents: Document[];
  onDocumentSelect?: (id: string) => void;
  selectedDocId?: string;
}

export function DocumentsSidebar({ documents, onDocumentSelect, selectedDocId }: DocumentsSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-56 border-r border-slate-700 bg-slate-900/50 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-200">youCards</h1>
        </div>
        
        <Link href="/agent">
          <Button 
            size="sm" 
            className={`w-full justify-start mb-3 ${
              pathname === '/agent' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </Link>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search decks..."
            className="pl-9 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 text-sm h-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {documents.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-slate-500">No decks yet</p>
              <p className="text-xs text-slate-600 mt-1">Start a new chat to create one</p>
            </div>
          )}
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/decks/${doc.id}`}
              className={`block w-full text-left p-3 rounded-lg transition-colors hover:bg-slate-800 ${
                selectedDocId === doc.id ? "bg-slate-800" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {doc.size} • {doc.time}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 mb-2">Storage: 12.4 GB / 15 GB</div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-[82%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

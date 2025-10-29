"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

interface EditableDeckHeaderProps {
  deckId: string;
  initialTitle: string;
  initialDescription?: string | null;
}

export function EditableDeckHeader({ deckId, initialTitle, initialDescription }: EditableDeckHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || "");

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to update deck");

      toast.success("Deck updated");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setDescription(initialDescription || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        {isEditing ? (
          <div className="flex-1 space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold bg-slate-900 border-slate-700 text-white"
              placeholder="Deck title"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-900 border-slate-700 text-slate-200"
              placeholder="Deck description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-white">{title}</h1>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-slate-400 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {description && <p className="text-slate-400 mt-2">{description}</p>}
            </div>
            <Link
              href={`/review/${deckId}`}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Start Review
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

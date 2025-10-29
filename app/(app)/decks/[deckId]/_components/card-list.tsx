"use client";

import { useState } from "react";
import { Card } from "@prisma/client";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CardListProps {
  initialCards: Card[];
  deckId: string;
}

export function CardList({ initialCards, deckId }: CardListProps) {
  const [cards, setCards] = useState(initialCards);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ front: "", back: "", codeSnippet: "", difficulty: 3 });

  const handleEdit = (card: Card) => {
    setEditingId(card.id);
    setEditForm({
      front: card.front,
      back: card.back,
      codeSnippet: card.codeSnippet || "",
      difficulty: card.difficulty || 3,
    });
  };

  const handleSave = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update card");

      const { card } = await response.json();
      setCards(cards.map((c) => (c.id === cardId ? card : c)));
      setEditingId(null);
      toast.success("Card updated");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm("Delete this card?")) return;

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete card");

      setCards(cards.filter((c) => c.id !== cardId));
      toast.success("Card deleted");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (cards.length === 0) {
    return <div className="text-slate-500 text-sm text-center py-8">No cards yet</div>;
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <div key={card.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          {editingId === card.id ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Front</label>
                <Textarea
                  value={editForm.front}
                  onChange={(e) => setEditForm({ ...editForm, front: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-slate-200"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Back</label>
                <Textarea
                  value={editForm.back}
                  onChange={(e) => setEditForm({ ...editForm, back: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-slate-200"
                  rows={3}
                />
              </div>
              {editForm.codeSnippet && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Code Snippet</label>
                  <Textarea
                    value={editForm.codeSnippet}
                    onChange={(e) => setEditForm({ ...editForm, codeSnippet: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-slate-200 font-mono text-sm"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSave(card.id)} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-white">{card.front}</div>
                  <div className="text-sm text-slate-400 mt-1">{card.back}</div>
                  {card.codeSnippet && (
                    <pre className="mt-2 bg-slate-900 border border-slate-600 rounded p-2 text-xs text-purple-300 overflow-x-auto">
                      {card.codeSnippet}
                    </pre>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(card)} className="h-8 w-8 text-slate-400 hover:text-white">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(card.id)} className="h-8 w-8 text-slate-400 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

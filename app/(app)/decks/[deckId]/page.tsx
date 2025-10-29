import prisma from "@/lib/prisma";
import { CardList } from "./_components/card-list";
import { EditableDeckHeader } from "./_components/editable-deck-header";

export default async function DeckDetailPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const deck = await prisma.deck.findUnique({ 
    where: { id: deckId }, 
    include: { 
      sources: true, 
      cards: { orderBy: { order: 'asc' } } 
    } 
  });
  if (!deck) return null;

  return (
    <div className="h-full overflow-auto bg-slate-950">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <EditableDeckHeader 
          deckId={deck.id}
          initialTitle={deck.title}
          initialDescription={deck.description}
        />

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h2 className="font-medium text-white mb-3">Sources</h2>
          <ul className="space-y-2">
            {deck.sources.map((s) => (
              <li key={s.id}>
                <a 
                  className="text-purple-400 hover:text-purple-300 text-sm underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  href={s.url}
                >
                  {s.title}
                </a>
              </li>
            ))}
            {deck.sources.length === 0 && <div className="text-slate-500 text-sm">No sources</div>}
          </ul>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h2 className="font-medium text-white mb-3">Cards ({deck.cards.length})</h2>
          <CardList initialCards={deck.cards} deckId={deck.id} />
        </div>
      </div>
    </div>
  );
}



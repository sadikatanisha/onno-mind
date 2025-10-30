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

        {deck.sources && deck.sources.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-purple-500/20 flex items-center justify-center">
                <span className="text-sm">🌐</span>
              </div>
              <h2 className="font-semibold text-purple-300">Web Sources Used</h2>
              <span className="text-xs text-purple-400/60 ml-auto">Powered by You.com</span>
            </div>
            <div className="grid gap-2">
              {deck.sources.map((s) => (
                <a 
                  key={s.id}
                  href={s.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all group"
                >
                  <div className="h-8 w-8 rounded bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🔗</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-purple-400 group-hover:text-purple-300 line-clamp-1">
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{s.provider}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h2 className="font-medium text-white mb-3">Cards ({deck.cards.length})</h2>
          <CardList initialCards={deck.cards} deckId={deck.id} />
        </div>
      </div>
    </div>
  );
}



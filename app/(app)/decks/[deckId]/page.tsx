import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DeckDetailPage({ params }: { params: { deckId: string } }) {
  const deck = await prisma.deck.findUnique({ where: { id: params.deckId }, include: { sources: true, cards: true } });
  if (!deck) return null;
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{deck.title}</h1>
        <Link href={`/review/${deck.id}`} className="underline">Start Review</Link>
      </div>
      <div>
        <h2 className="font-medium">Sources</h2>
        <ul className="list-disc pl-6">
          {deck.sources.map((s) => (
            <li key={s.id}><a className="underline" target="_blank" href={s.url}>{s.title}</a></li>
          ))}
          {deck.sources.length === 0 && <div>No sources</div>}
        </ul>
      </div>
      <div>
        <h2 className="font-medium">Cards ({deck.cards.length})</h2>
        <ul className="space-y-2">
          {deck.cards.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <div className="font-medium">{c.front}</div>
              <div className="text-sm text-zinc-700">{c.back}</div>
            </li>
          ))}
          {deck.cards.length === 0 && <div>No cards yet</div>}
        </ul>
      </div>
    </main>
  );
}



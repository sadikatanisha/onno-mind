import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuizChat } from "./_components/quiz-chat";

export default async function QuizPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { deckId } = await params;

  const deck = await prisma.deck.findUnique({
    where: { id: deckId, userId },
    include: {
      cards: true,
    },
  });

  if (!deck) {
    redirect("/dashboard");
  }

  return <QuizChat deck={deck} userId={userId} />;
}

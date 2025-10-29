import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardChat } from "./_components/dashboard-chat";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) return null;
  
  const decks = await prisma.deck.findMany({ 
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardChat 
      deckTitle={decks[0]?.title || "Welcome to youCards"}
      userImage={user?.imageUrl}
      userName={user?.firstName || "User"}
    />
  );
}



import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DocumentsSidebar } from "@/app/(app)/_components/documents-sidebar";
import { AppNavbar } from "@/app/(app)/_components/app-navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) return null;
  
  const decks = await prisma.deck.findMany({ 
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const documents = decks.map((d: { id: string; title: string }) => ({
    id: d.id,
    title: d.title,
    size: "2.4 MB",
    time: "2 hours ago",
  }));

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppNavbar userName={user?.firstName || "User"} />
      <div className="flex flex-1 overflow-hidden">
        <DocumentsSidebar documents={documents} />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

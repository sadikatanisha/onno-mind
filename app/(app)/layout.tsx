import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ConversationSidebar } from "@/app/(app)/_components/conversation-sidebar";
import { AppNavbar } from "@/app/(app)/_components/app-navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppNavbar userName={user?.firstName || "User"} />
      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

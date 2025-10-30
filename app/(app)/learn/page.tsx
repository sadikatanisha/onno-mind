import { auth, currentUser } from "@clerk/nextjs/server";
import { AgentChat } from "./_components/agent-chat";

export default async function AgentPage() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) return (
    <div className="flex items-center justify-center h-screen">Sined Out</div>
  );

  return (
    <AgentChat 
      deckTitle="AI Learning Assistant"
      userImage={user?.imageUrl}
      userName={user?.firstName || "User"}
    />
  );
}



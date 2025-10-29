import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // TEMP: Allow unauthenticated access to this endpoint for local testing/demo.
  // To re-enable protection, set NEXT_PUBLIC_PUBLIC_CHAT to anything other than "true"
  // or remove this block and rely solely on Clerk auth below.
  const allowPublic = process.env.NEXT_PUBLIC_PUBLIC_CHAT === "true";

  if (!allowPublic) {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { message, conversationHistory } = await req.json();

  if (!process.env.YOU_API_KEY) {
    return Response.json({ error: "YOU_API_KEY not configured" }, { status: 500 });
  }

  try {
    const systemPrompt = `You are a helpful AI assistant that helps users create and learn with flashcards.

IMPORTANT INSTRUCTIONS:
1. If the user's question is vague or needs clarification, ask 2-3 relevant follow-up questions to better understand their needs
2. When providing information, ALWAYS cite your sources at the end of your response
3. Be conversational and educational
4. When discussing topics, suggest creating flashcards if relevant

When asking clarifying questions, format them as a numbered list.
When citing sources, use the format: "Sources: [1] Title (url), [2] Title (url)"`;

    const response = await fetch("https://api.you.com/v1/agents/runs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent: "advanced",
        input: `${systemPrompt}\n\nUser: ${message}`,
        stream: false,
        verbosity: "high"
      }),
    });

    if (!response.ok) {
      throw new Error(`You.com API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.output?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    const sources = data.output?.[0]?.citations || [];

    return Response.json({ 
      message: aiResponse,
      sources: sources 
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

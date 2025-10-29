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

CRITICAL RULES:
1. **ALWAYS ask clarifying questions FIRST when the user's request is vague, unclear, or lacks context**
2. Keep your responses SHORT and conversational - maximum 3-4 sentences
3. Do NOT write long reports or essays
4. When asking questions, ask 2-3 specific questions to understand what the user needs
5. Only provide detailed answers AFTER you have enough context from the user
6. When providing information, briefly cite sources at the end

EXAMPLES:
- If user says "make it based on js" → Ask: "What would you like to create with JavaScript? A web app, flashcards, a game, or something else?"
- If user says "teach me React" → Ask: "Are you new to React or looking to learn specific features? What's your current JavaScript experience?"

Remember: Ask questions FIRST, answer AFTER you understand their needs.`;

    // Build conversation context from last 5 messages only (to keep context relevant)
    const recentHistory = conversationHistory && conversationHistory.length > 0
      ? conversationHistory.slice(-5)
      : [];

    const conversationContext = recentHistory.length > 0
      ? '\n\nRecent conversation:\n' + recentHistory.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    const fullInput = `${systemPrompt}${conversationContext}\n\nUser: ${message}`;

    const response = await fetch("https://api.you.com/v1/agents/runs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent: "advanced",
        input: fullInput,
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

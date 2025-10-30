import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import type { ConversationMode } from "@/lib/types/conversation";

export type YouAPIMode = "search" | "smart" | "advanced";

export async function POST(req: NextRequest) {
  // Require authentication
  const { userId } = await auth();
  
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, conversationHistory, conversationId, mode, topic, youMode = "advanced" } = await req.json() as {
    message: string;
    conversationHistory?: Array<{ role: string; content: string }>;
    conversationId?: string;
    mode?: ConversationMode;
    topic?: string;
    youMode?: YouAPIMode;
  };

  if (!process.env.YOU_API_KEY) {
    return Response.json({ 
      error: "You.com API key not configured. Please add YOU_API_KEY to your environment variables." 
    }, { status: 500 });
  }

  console.log('📨 Chat API called:', { mode, topic, youMode, hasMessage: !!message });

  try {
    let aiResponse = "";
    let sources: any[] = [];

    const chatSystemPrompt = `You are a helpful AI assistant with REAL-TIME WEB ACCESS that helps users learn anything.

YOUR SUPERPOWER: You can search the web in real-time and cite authoritative sources!

CRITICAL RULES:
1. Keep responses SHORT and conversational (3-4 sentences max)
2. Ask clarifying questions when requests are vague
3. ALWAYS cite sources using [Source Name](URL) format when providing facts
4. Emphasize: "I'm pulling the latest information from the web for you!"

Remember: You're a conversational assistant, not a long-form writer.`;

    const quizSystemPrompt = `You are a friendly quiz tutor helping students learn "${topic || 'various topics'}".

YOUR TEACHING APPROACH:
1. START: If user says "ready", greet warmly and ask your FIRST question
2. Ask ONE clear question at a time
3. FEEDBACK: After they answer, give brief feedback (1-2 sentences) and move to next question
4. Keep responses SHORT - maximum 2-3 sentences
5. After 5-7 questions, summarize performance

Remember: You're a supportive tutor. Make learning enjoyable and keep it brief!`;

    const systemPrompt = mode === "quiz" ? quizSystemPrompt : chatSystemPrompt;

    // Build conversation context from last 5 messages
    const recentHistory = conversationHistory && conversationHistory.length > 0
      ? conversationHistory.slice(-5)
      : [];

    const conversationContext = recentHistory.length > 0
      ? '\n\nRecent conversation:\n' + recentHistory.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    const fullInput = `${systemPrompt}${conversationContext}\n\nUser: ${message}`;

    // MODE 1: ADVANCED AGENT (Conversational AI with web search)
    if (youMode === "advanced" || youMode === "smart") {
      console.log('🤖 Trying You.com Advanced Agent');
      
      try {
        const agentResponse = await fetch("https://api.you.com/v1/agents/runs", {
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

        if (agentResponse.ok) {
          const data = await agentResponse.json();
          aiResponse = data.output?.[0]?.text || "";
          sources = data.output?.[0]?.citations || [];
          console.log('✅ Advanced Agent success');
        } else {
          const errorText = await agentResponse.text();
          console.error(`❌ Advanced Agent error (${agentResponse.status}):`, errorText);
          
          throw new Error(`You.com Advanced Agent returned ${agentResponse.status}. This may require a paid plan. Try switching to Search mode or contact api@you.com.`);
        }
      } catch (error: any) {
        console.error('❌ Advanced Agent failed:', error);
        throw new Error(error.message || 'Advanced Agent is unavailable. Try Search mode.');
      }
    }
    
    // MODE 2: SEARCH (Raw Results)
    else if (youMode === "search") {
      console.log('🔍 Trying Search mode');
      
      try {
        const searchParams = new URLSearchParams({
          query: message,
          count: '10',
          freshness: 'month',
        });

        const searchResponse = await fetch(
          `https://api.ydc-index.io/v1/search?${searchParams}`,
          {
            headers: {
              'X-API-Key': process.env.YOU_API_KEY,
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          sources = searchData.results?.web || [];
          console.log(`✅ Search API returned ${sources.length} results`);
          
          if (sources.length > 0) {
            aiResponse = `**You.com Search Results:**\n\n${sources.map((s: any, i: number) => 
              `**[${i + 1}] ${s.title}**\n${s.snippets?.[0] || s.description}\n🔗 [Read more](${s.url})\n📅 ${new Date(s.page_age).toLocaleDateString()}`
            ).join('\n\n')}`;
          } else {
            aiResponse = `No search results found for "${message}".\n\n**Possible reasons:**\n- Your You.com API tier may not include Search API access\n- Try a different search query\n- Contact api@you.com for API access questions\n\n**Tip:** Try switching to Smart Learning Assistant mode, or rephrase your search.`;
          }
        } else {
          const errorText = await searchResponse.text();
          console.error(`❌ Search API error (${searchResponse.status}):`, errorText);
          throw new Error(`Search API returned status ${searchResponse.status}. This may require API access configuration.`);
        }
      } catch (error: any) {
        console.error('❌ Search API failed:', error);
        throw new Error(error.message || 'You.com Search is currently unavailable. Please check your API key or try Smart mode.');
      }
    }

    // Persist messages if conversationId is provided
    if (conversationId && userId) {
      await prisma.message.create({
        data: {
          conversationId,
          role: "user",
          content: message,
        },
      });

      await prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          content: aiResponse,
        },
      });
    }

    if (!aiResponse) {
      console.error('❌ No AI response generated');
      throw new Error('Failed to generate response. Please try again or switch You.com mode.');
    }

    console.log('✅ Chat API success:', { responseLength: aiResponse.length, sourcesCount: sources.length });

    return Response.json({ 
      message: aiResponse,
      sources: sources,
      mode: youMode,
    });
  } catch (error: any) {
    console.error("❌ Chat API error:", error);
    console.error("Error stack:", error.stack);
    
    return Response.json({ 
      error: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateWithExpress, runCustomAgent } from "@/lib/you-api";

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { prompt, agentId, stream = false } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.YOU_API_KEY) {
      console.warn('YOU_API_KEY not configured - skipping You.com agent');
      return NextResponse.json({ 
        output: [{ 
          type: 'error', 
          text: 'You.com API not configured',
          message: 'Add YOU_API_KEY to .env.local'
        }]
      });
    }

    let result;

    if (agentId) {
      // Use custom agent if agentId is provided
      result = await runCustomAgent(agentId, prompt, stream);
    } else {
      // Use Express agent by default
      result = await generateWithExpress(prompt, stream);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('You.com Agent API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to run You.com agent' },
      { status: 500 }
    );
  }
}

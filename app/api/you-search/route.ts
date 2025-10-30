import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { searchYou } from "@/lib/you-api";

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { query, freshness = 'month', count = 10 } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.YOU_API_KEY) {
      console.warn('YOU_API_KEY not configured - returning empty results');
      return NextResponse.json({ 
        results: { web: [] },
        metadata: { query, message: 'YOU_API_KEY not configured' }
      });
    }

    const results = await searchYou(query, {
      count,
      freshness,
      safesearch: 'moderate',
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('You.com Search API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search You.com' },
      { status: 500 }
    );
  }
}

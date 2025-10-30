/**
 * You.com API Wrapper
 * Official Documentation: https://documentation.you.com
 */

export interface YouSearchResult {
  url: string;
  title: string;
  description: string;
  snippets: string[];
  thumbnail_url?: string;
  page_age: string;
  favicon_url?: string;
  authors?: string[];
}

export interface YouSearchResponse {
  results: {
    web: YouSearchResult[];
    news?: YouSearchResult[];
  };
  metadata: {
    query: string;
    search_uuid: string;
    latency: number;
  };
}

export interface YouExpressResponse {
  output: Array<{
    type: string;
    text: string;
    content: string;
    agent: string;
  }>;
}

export interface YouSearchOptions {
  count?: number;
  freshness?: 'day' | 'week' | 'month' | 'year';
  offset?: number;
  country?: string;
  safesearch?: 'off' | 'moderate' | 'strict';
}

/**
 * Search You.com for web results with citations
 */
export async function searchYou(
  query: string, 
  options: YouSearchOptions = {}
): Promise<YouSearchResponse> {
  const apiKey = process.env.YOU_API_KEY;
  
  if (!apiKey) {
    throw new Error('YOU_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    query,
    count: String(options.count || 10),
    ...(options.freshness && { freshness: options.freshness }),
    ...(options.offset && { offset: String(options.offset) }),
    ...(options.country && { country: options.country }),
    ...(options.safesearch && { safesearch: options.safesearch }),
  });

  const response = await fetch(
    `https://api.ydc-index.io/v1/search?${params}`,
    {
      headers: {
        'X-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`You.com Search API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Use You.com Express Agent for AI-powered responses with web search
 */
export async function generateWithExpress(
  prompt: string,
  stream = false
): Promise<YouExpressResponse> {
  const apiKey = process.env.YOU_API_KEY;
  
  if (!apiKey) {
    throw new Error('YOU_API_KEY is not configured');
  }

  const response = await fetch('https://api.ydc-index.io/v1/agents/runs', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent: 'express',
      input: prompt,
      stream,
      tools: [{ type: 'web_search' }],
    }),
  });

  if (!response.ok) {
    throw new Error(`You.com Express API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Use a Custom Agent (requires agent ID from You.com platform)
 * Create your custom agent at: https://you.com/platform
 */
export async function runCustomAgent(
  agentId: string,
  input: string,
  stream = false
) {
  const apiKey = process.env.YOU_API_KEY;
  
  if (!apiKey) {
    throw new Error('YOU_API_KEY is not configured');
  }

  const response = await fetch('https://api.ydc-index.io/v1/agents/runs', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent: agentId,
      input,
      stream,
    }),
  });

  if (!response.ok) {
    throw new Error(`You.com Custom Agent API error: ${response.status}`);
  }

  if (stream) {
    return response.body; // Return stream for SSE
  }

  return response.json();
}

/**
 * Helper: Calculate how long ago a source was published
 */
export function getTimeSince(pageAge: string): string {
  const date = new Date(pageAge);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Helper: Get freshness badge based on page age
 */
export function getSourceFreshness(pageAge: string) {
  const date = new Date(pageAge);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return { badge: '✨ Fresh', color: 'green', level: 'high' };
  }
  if (diffDays < 30) {
    return { badge: '⏰ Recent', color: 'yellow', level: 'medium' };
  }
  return { badge: '📚 Archived', color: 'gray', level: 'low' };
}

/**
 * Mock You.com Smart API responses for demo/fallback
 */

export interface MockSmartResponse {
  answer: string;
  search_results: Array<{
    url: string;
    title: string;
    description: string;
    snippets: string[];
    page_age: string;
    favicon_url?: string;
  }>;
}

export const MOCK_SMART_RESPONSES: Record<string, MockSmartResponse> = {
  "react": {
    answer: "React is a popular JavaScript library for building user interfaces, developed by Meta (Facebook). React 19, the latest version, introduces several powerful features including Server Components, Actions, and improved hooks like `useOptimistic` and `useTransition`. These features enable better performance and more intuitive patterns for handling asynchronous operations and managing UI state.",
    search_results: [
      {
        url: "https://react.dev/blog/2024/12/05/react-19",
        title: "React 19 – React",
        description: "React 19 is now available on npm! In this post, we'll give an overview of what's new in React 19.",
        snippets: [
          "React 19 introduces Server Components, Actions, and new hooks for better async handling and optimistic UI updates."
        ],
        page_age: "2024-12-05T10:00:00",
        favicon_url: "https://react.dev/favicon.ico"
      },
      {
        url: "https://react.dev/reference/react",
        title: "React Reference Overview – React",
        description: "This section provides detailed reference documentation for working with React.",
        snippets: [
          "React provides hooks like useState, useEffect, and the new useOptimistic for modern UI development."
        ],
        page_age: "2024-11-20T14:30:00",
        favicon_url: "https://react.dev/favicon.ico"
      }
    ]
  },
  "javascript": {
    answer: "JavaScript is a versatile programming language primarily used for web development. Modern JavaScript (ES2024) includes features like array methods (map, filter, reduce), async/await for handling promises, destructuring, spread operators, and modules. Key array methods include: `map()` for transformation, `filter()` for selection, `reduce()` for aggregation, `find()` for searching, and `forEach()` for iteration.",
    search_results: [
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
        title: "Array - JavaScript | MDN",
        description: "The Array object enables storing a collection of multiple items under a single variable name.",
        snippets: [
          "Arrays come with many built-in methods: map(), filter(), reduce(), find(), forEach(), and more for efficient data manipulation."
        ],
        page_age: "2024-12-01T09:15:00",
        favicon_url: "https://developer.mozilla.org/favicon.ico"
      },
      {
        url: "https://javascript.info/array-methods",
        title: "Array methods - JavaScript.info",
        description: "A comprehensive guide to JavaScript array methods with examples.",
        snippets: [
          "Modern JavaScript array methods make data transformation easy: use map() to transform, filter() to select, and reduce() to aggregate."
        ],
        page_age: "2024-11-15T16:45:00"
      }
    ]
  },
  "typescript": {
    answer: "TypeScript is a strongly typed programming language that builds on JavaScript, developed by Microsoft. TypeScript 5.5, released in 2024, introduces inferred type predicates, control flow narrowing improvements, and better performance. Key features include: static typing, interfaces, generics, enums, and compile-time type checking. TypeScript compiles to plain JavaScript and works with any JavaScript runtime.",
    search_results: [
      {
        url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html",
        title: "TypeScript 5.5 Release Notes",
        description: "Learn about the new features and improvements in TypeScript 5.5.",
        snippets: [
          "TypeScript 5.5 introduces inferred type predicates, making type narrowing more powerful and intuitive."
        ],
        page_age: "2024-06-20T11:00:00"
      }
    ]
  },
  "default": {
    answer: "I'm a Smart Learning Assistant powered by You.com! I can help you learn about any topic by searching the latest web sources and providing clear explanations with citations. Try asking me about: programming languages, frameworks, web development concepts, or any educational topic you'd like to explore!",
    search_results: [
      {
        url: "https://you.com",
        title: "You.com - The AI Search Engine You Control",
        description: "You.com puts you in control of your AI search experience with fresh, cited results.",
        snippets: [
          "You.com provides real-time search results with citations, ensuring you get the most up-to-date information."
        ],
        page_age: new Date().toISOString()
      }
    ]
  }
};

/**
 * Get mock Smart API response based on query
 */
export function getMockSmartResponse(query: string): MockSmartResponse {
  const lowerQuery = query.toLowerCase();
  
  // Find best matching mock response
  for (const [keyword, response] of Object.entries(MOCK_SMART_RESPONSES)) {
    if (keyword !== 'default' && lowerQuery.includes(keyword)) {
      return response;
    }
  }
  
  // Return default if no match
  return MOCK_SMART_RESPONSES.default;
}

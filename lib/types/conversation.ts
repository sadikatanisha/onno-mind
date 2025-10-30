export type ConversationMode = "chat" | "quiz";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  topic?: string;
  mode: ConversationMode;
  summary?: string;
  deckId?: string;
  quizScore?: number;
  quizTotal?: number;
  quizCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

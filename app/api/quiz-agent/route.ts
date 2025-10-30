import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface QuizAgentRequest {
    deckId: string;
    conversationData: {
        title: string;
        cards: Array<{ front: string; back: string }>;
        messages?: Array<{ role: string; content: string }>;
    };
    userAnswer?: string;
    conversationHistory: Array<{ role: string; content: string }>;
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            deckId,
            conversationData,
            userAnswer,
            conversationHistory,
        }: QuizAgentRequest = await req.json();

        const youApiKey = process.env.YOU_API_KEY;
        if (!youApiKey) {
            throw new Error(
                "YOU_API_KEY is not configured. Please add it to your .env.local file."
            );
        }

        // Build context from conversation data
        const cardContext = conversationData.cards
            .map(
                (card, i) => `Card ${i + 1}:\nQuestion: ${card.front}\nAnswer: ${card.back}`
            )
            .join("\n\n");

        // Build comprehensive input for the Advanced Agent
        let agentInput = "";

        // First message: Generate quiz questions
        if (conversationHistory.length === 0) {
            agentInput = `You are a quiz tutor for the topic: "${conversationData.title}".

Here is the study material (flashcards):
${cardContext}

Your task:
1. Generate ONE thoughtful quiz question based on the material above
2. The question should test understanding, not just memorization
3. Make it engaging and clear
4. Wait for the student's answer before proceeding

Generate your first question now.`;
        }
        // Subsequent messages: Evaluate answer and continue quiz
        else if (userAnswer) {
            agentInput = `You are a quiz tutor for the topic: "${conversationData.title}".

Study material:
${cardContext}

Previous conversation:
${conversationHistory
                    .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
                    .join("\n")}

Student's latest answer: "${userAnswer}"

Your task:
1. Evaluate the student's answer based on the study material
2. Provide constructive feedback (correct/incorrect and why)
3. If correct, acknowledge and explain
4. If incorrect, gently correct and explain the right answer
5. Then ask the NEXT quiz question based on the material

Respond now.`;
        } else {
            // Continuation without specific answer (e.g., "next question")
            agentInput = `You are a quiz tutor for the topic: "${conversationData.title}".

Study material:
${cardContext}

Previous conversation:
${conversationHistory
                    .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
                    .join("\n")}

The student wants to continue. Generate the next quiz question based on the study material.`;
        }

        // Call You.com Advanced Agent API
        const response = await fetch("https://api.you.com/v1/agents/runs", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${youApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agent: "advanced",
                input: agentInput,
                stream: false,
                verbosity: "medium",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("You.com API error:", response.status, errorText);
            throw new Error(
                `You.com API error: ${response.status} - ${errorText || response.statusText}`
            );
        }

        const data = await response.json();

        // Extract the agent's response
        const agentResponse =
            data.output?.[0]?.text ||
            data.output?.[0]?.content ||
            "I'm having trouble generating a question right now. Please try again.";

        return NextResponse.json({
            response: agentResponse,
            success: true,
        });
    } catch (error: any) {
        console.error("Quiz agent error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to process quiz request",
                success: false,
            },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    await connectDB();
    // Fetch last 50 mistakes to analyze
    const mistakes = await Mistake.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    if (mistakes.length === 0) {
      return new NextResponse(
        JSON.stringify({
          insight:
            "No journal entries found to analyze. Log some mistakes first!",
        }),
        { status: 200 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse(
        JSON.stringify({
          insight:
            "**Mock Insight**:\n\n1. **Weakness**: Dynamic Programming.\n2. **Reason**: Implementing bottom-up approaches.\n\n(Add GEMINI_API_KEY for real analysis)",
        }),
        { status: 200 },
      );
    }

    const journalContent = mistakes
      .map(
        (m) =>
          `- Problem: ${m.problemName} (${m.topic})
       - Type: ${m.mistakeType}
       - Reflection: ${m.reflection}`,
      )
      .join("\n");

    const prompt = `
      You are a coding mentor. Here are my recent mistake journal entries from my coding practice:

      ${journalContent}

      Based on these entries, provide a concise but impactful analysis in Markdown format.
      1. **Top Weaknesses**: Identify my top 3 weak topics or patterns of error.
      2. **Root Cause Analysis**: Summarize why I am making these mistakes (e.g., rushing, lack of concept clarity, edge cases).
      3. **Actionable Advice**: Give me 1 specific actionable piece of advice to improve.
      
      Keep the tone encouraging but objective. Use emojis where appropriate to make it friendly.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insight = response.text();

    return new NextResponse(JSON.stringify({ insight }), { status: 200 });
  } catch (error) {
    console.error("Insight Error", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";
import User from "@/models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

import { checkAndDeductCredits } from "@/lib/rateLimit";

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

    const totalMistakes = await Mistake.countDocuments({
      user: session.user.id,
    });

    if (mistakes.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Please connect your LeetCode account or add mistake logs to generate an AI report.",
        }),
        { status: 400 },
      );
    }

    // Check Quota (Cost: 5)
    // Only deduct if we actually perform analysis
    const quota = await checkAndDeductCredits(session.user.id, 5);
    if (!quota.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Daily AI quota exceeded. Upgrade to Premium for more!",
          credits: quota.credits,
        }),
        { status: 402 },
      );
    }

    let insight = "";
    let suggestedProblems = [];

    if (!process.env.GEMINI_API_KEY) {
      insight =
        "**Mock Insight**:\n\n1. **Weakness**: Dynamic Programming.\n2. **Reason**: Implementing bottom-up approaches.\n\n(Add GEMINI_API_KEY for real analysis)";
      suggestedProblems = [
        {
          problemName: "Climbing Stairs",
          difficulty: "Easy",
          topic: "DP",
          link: "https://leetcode.com/problems/climbing-stairs/",
        },
        {
          problemName: "Coin Change",
          difficulty: "Medium",
          topic: "DP",
          link: "https://leetcode.com/problems/coin-change/",
        },
      ];
    } else {
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

        Based on these entries, primarily your task is to analyze my weaknesses and suggest concrete LeetCode problems to practice.
        
        Return your response in strictly VALID JSON format (no markdown formatting like \`\`\`json). The structure should be:
        {
            "insight": "markdown string containing: 1. Top Weaknesses (Exactly 2), 2. Root Cause Analysis (Exactly 2 points), 3. Actionable Advice (Exactly 2 points). Use bolding and emojis. Keep it concise.",
            "suggestedProblems": [
                { "problemName": "Name of problem", "difficulty": "Easy/Medium/Hard", "topic": "Main Topic", "link": "https://leetcode.com/problems/problem-slug/" }
            ]
        }
        
        For suggestedProblems, provide exactly 2 specific LeetCode problems that directly address my weaknesses identified in the journal.
        `;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Clean markdown code fence if present
        const cleanText = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const data = JSON.parse(cleanText);
        insight = data.insight;
        suggestedProblems = data.suggestedProblems;
      } catch (e) {
        console.error("JSON Parsing failed", e);
        insight = text; // Fallback
      }
    }

    // Save to User model
    await User.findByIdAndUpdate(
      session.user.id,
      {
        latestInsight: insight,
        suggestedProblems: suggestedProblems,
        mistakeCountAtLastInsight: totalMistakes,
      },
      { strict: false },
    );

    return new NextResponse(JSON.stringify({ insight }), { status: 200 });
  } catch (error) {
    console.error("Insight Error", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

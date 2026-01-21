import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function POST(req) {
  try {
    const { code, language, type, previousHints = [] } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse(
        JSON.stringify({
          result:
            type === "hint"
              ? "Use a hash map."
              : "Mock Solution: Use HashMap to store visited elements.",
        }),
        { status: 200 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";
    if (type === "hint") {
      prompt = `
        You are a coding tutor. The user is stuck on a problem and has written the following ${language} code.
        
        Code:
        ${code}

        Previous hints given (do not repeat these):
        ${previousHints.join("; ")}

        Task: Analyze the code for mistakes and provide a WITTY, slightly CRYPTIC hint. 
        
        Constraints:
        - Do NOT simply state the error. Be specific but playful. 
        - Use humor or a riddle.
        - Output ONLY the hint text.
        - Max 15 words.
        - Examples:
          "Your set is as empty as deep space; try filling it."
          "That loop is running forever, much like my existential dread."
          "You're looking for an index, but found a value. Awkward."
      `;
    } else if (type === "solution") {
      prompt = `
        You are a coding tutor. The user has given up and wants the solution.
        
        Code context:
        ${code}

        Task: Infer the problem and provide the full, correct, and optimized ${language} solution.

        Constraints:
        - Output ONLY the raw code. 
        - DO NOT include markdown formatting (like \`\`\`cpp).
        - DO NOT include an explanation or introduction.
        - The response should be compilable/runnable code only.
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present (Gemini sometimes adds them despite instructions)
    const cleanText = text
      .replace(/^```[a-z]*\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    return new NextResponse(JSON.stringify({ result: cleanText }), {
      status: 200,
    });
  } catch (error) {
    console.error("Analyzer Assist Error", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

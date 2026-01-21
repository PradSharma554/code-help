import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function POST(req) {
  try {
    const { code, language } = await req.json();

    // Basic Static Analysis (Regex)
    const stats = {
      loops: (code.match(/for\s*\(|while\s*\(/g) || []).length,
      nestedLoops: (code.match(/for\s*\(.*for\s*\(/s) || []).length > 0, // Very naive check
      recursion:
        (code.match(/function\s+(\w+).*return\s+\1/s) || []).length > 0,
    };

    let analysisResult;

    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Analyze the time and space complexity of the following ${language} code.
        Focus on Big-O notation.
        
        Code:
        ${code}
        
        Return the response in JSON format with fields:
        "timeComplexity": "e.g. O(n log n)",
        "spaceComplexity": "e.g. O(n)",
        "explanation": "1 sentence max technical explanation",
        "improvements": "one or two sentences on optimization or 'Optimal'"
        
        Do not include markdown formatting (like \`\`\`json). Just return the raw JSON.
      `;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present (Gemini sometimes adds them despite instructions)
        const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();

        try {
          analysisResult = JSON.parse(jsonString);
        } catch (e) {
          console.error("JSON Parse Error", e, jsonString);
          analysisResult = {
            timeComplexity: "Unknown",
            spaceComplexity: "Unknown",
            explanation: text,
            improvements: "N/A",
          };
        }
      } catch (aiError) {
        console.error("AI Error", aiError);
        // Fallback to mock if AI fails
        analysisResult = getMockAnalysis(stats);
      }
    } else {
      // Mock if no API key
      analysisResult = getMockAnalysis(stats);
    }

    return new NextResponse(JSON.stringify({ ...analysisResult, stats }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

function getMockAnalysis(stats) {
  // Deterministic mock based on static stats
  let time = "O(n)";
  let explanation = "Single pass detected.";

  if (stats.loops > 1) {
    time = stats.nestedLoops ? "O(n^2)" : "O(n)";
    explanation = stats.nestedLoops
      ? "Nested loops detected, likely quadratic time."
      : "Multiple loops detected, but they appear sequential.";
  }

  return {
    timeComplexity: time,
    spaceComplexity: "O(1)",
    explanation:
      explanation + " (Mock mode: Add GEMINI_API_KEY for real AI analysis)",
    improvements: "Check if the nested loop is necessary.",
  };
}

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { checkAndDeductCredits } = require("../lib/rateLimit");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

function getMockAnalysis(stats) {
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

exports.analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const quota = await checkAndDeductCredits(req.user._id, 1);
    if (!quota.success) {
      const statusCode = quota.message.includes("verify") ? 403 : 402;
      return res.status(statusCode).json({
        error: quota.message,
        credits: quota.credits,
      });
    }

    const stats = {
      loops: (code.match(/for\s*\(|while\s*\(/g) || []).length,
      nestedLoops: (code.match(/for\s*\(.*for\s*\(/s) || []).length > 0,
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
        analysisResult = getMockAnalysis(stats);
      }
    } else {
      analysisResult = getMockAnalysis(stats);
    }

    res.status(200).json({ ...analysisResult, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assist = async (req, res) => {
  try {
    const { code, language, type, previousHints = [] } = req.body;

    const quota = await checkAndDeductCredits(req.user._id, 1);
    if (!quota.success) {
      const statusCode = quota.message.includes("verify") ? 403 : 402;
      return res.status(statusCode).json({
        error: quota.message,
        credits: quota.credits,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        result:
          type === "hint"
            ? "Use a hash map."
            : "Mock Solution: Use HashMap to store visited elements.",
      });
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

    const cleanText = text
      .replace(/^```[a-z]*\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    res.status(200).json({ result: cleanText });
  } catch (error) {
    console.error("Analyzer Assist Error", error);
    res.status(500).json({ error: error.message });
  }
};

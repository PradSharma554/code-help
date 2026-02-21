const Mistake = require("../models/Mistake");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { checkAndDeductCredits } = require("../lib/rateLimit");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

exports.getInsight = async (req, res) => {
  try {
    const mistakes = await Mistake.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const totalMistakes = await Mistake.countDocuments({
      user: req.user._id,
    });

    if (mistakes.length === 0) {
      return res.status(400).json({
        error:
          "Please connect your LeetCode account or add mistake logs to generate an AI report.",
      });
    }

    const quota = await checkAndDeductCredits(req.user._id, 5);
    if (!quota.success) {
      const statusCode = quota.message.includes("verify") ? 403 : 402;
      return res.status(statusCode).json({
        error: quota.message,
        credits: quota.credits,
      });
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
        const cleanText = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const data = JSON.parse(cleanText);
        insight = data.insight;
        suggestedProblems = data.suggestedProblems;
      } catch (e) {
        console.error("JSON Parsing failed", e);
        insight = text;
      }
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        latestInsight: insight,
        suggestedProblems: suggestedProblems,
        mistakeCountAtLastInsight: totalMistakes,
      },
      { strict: false },
    );

    res.status(200).json({ insight });
  } catch (error) {
    console.error("Insight Error", error);
    res.status(500).json({ error: error.message });
  }
};

const mongoose = require("mongoose");

const MistakeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemName: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "Codeforces", "HackerRank", "Other"],
      default: "LeetCode",
    },
    topic: {
      type: String, // e.g., "DP", "Graph", "Greedy"
      required: true,
    },
    mistakeType: {
      type: String,
      enum: [
        "Wrong Approach",
        "Edge Case",
        "TLE",
        "Logic Bug",
        "Implementation Error",
        "Other",
      ],
      required: true,
    },
    reflection: {
      type: String,
      required: true,
    },
    codeSnippet: {
      // Optional link to code
      type: String,
    },
    complexityAnalysis: {
      // Snapshot of complexity if analyzed
      time: String,
      space: String,
      note: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Mistake", MistakeSchema);

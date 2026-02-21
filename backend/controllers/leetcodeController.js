const Mistake = require("../models/Mistake");
const User = require("../models/User");
const {
  getRecentSubmissions,
  getProblemTags,
  getUserStats,
} = require("../lib/leetcode");

exports.sync = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username required" });
    }

    const [recentSubmissions, userStats] = await Promise.all([
      getRecentSubmissions(username),
      getUserStats(username),
    ]);

    if (userStats && userStats.length > 0) {
      const total = userStats.find((s) => s.difficulty === "All")?.count || 0;
      const easy = userStats.find((s) => s.difficulty === "Easy")?.count || 0;
      const medium =
        userStats.find((s) => s.difficulty === "Medium")?.count || 0;
      const hard = userStats.find((s) => s.difficulty === "Hard")?.count || 0;

      await User.findByIdAndUpdate(
        req.user._id,
        {
          leetcodeStats: {
            totalSolved: total,
            easySolved: easy,
            mediumSolved: medium,
            hardSolved: hard,
          },
        },
        { strict: false },
      );
    }

    const failures = recentSubmissions.filter(
      (sub) => sub.statusDisplay !== "Accepted",
    );

    if (failures.length === 0) {
      return res.status(200).json({
        count: 0,
        message: "Stats updated. No recent failed submissions found.",
      });
    }

    let newEntries = 0;

    for (const sub of failures) {
      const submissionDate = new Date(parseInt(sub.timestamp) * 1000);

      const exists = await Mistake.findOne({
        user: req.user._id,
        problemName: sub.title,
        createdAt: {
          $gte: new Date(submissionDate.getTime() - 60000),
          $lte: new Date(submissionDate.getTime() + 60000),
        },
      });

      if (!exists) {
        let topic = await getProblemTags(sub.titleSlug);
        if (!topic || topic.trim() === "") {
          topic = "General";
        }

        let mistakeType = "Other";
        if (sub.statusDisplay === "Time Limit Exceeded") mistakeType = "TLE";
        else if (sub.statusDisplay === "Wrong Answer")
          mistakeType = "Wrong Approach";
        else if (sub.statusDisplay === "Runtime Error")
          mistakeType = "Logic Bug";

        await Mistake.create({
          user: req.user._id,
          problemName: sub.title,
          platform: "LeetCode",
          topic: topic,
          mistakeType: mistakeType,
          reflection:
            "Auto-synced from LeetCode. Please update with your reflection.",
          codeSnippet: "",
          createdAt: submissionDate,
        });
        newEntries++;
      }
    }

    res.status(200).json({
      count: newEntries,
      message: `Synced ${newEntries} new failed submissions.`,
    });
  } catch (error) {
    console.error("Sync Error", error);
    res.status(500).json({ error: error.message });
  }
};

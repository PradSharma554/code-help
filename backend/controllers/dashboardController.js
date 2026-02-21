const Mistake = require("../models/Mistake");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).lean();
    const totalMistakes = await Mistake.countDocuments({ user: userId });

    const mistakeTypeStats = await Mistake.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$mistakeType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const topicStats = await Mistake.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          topics: { $split: ["$topic", ","] },
        },
      },
      { $unwind: "$topics" },
      {
        $project: {
          topic: { $trim: { input: "$topics" } },
        },
      },
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentMistakes = await Mistake.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const now = new Date();
    const lastRefill = user?.lastRefillDate
      ? new Date(user.lastRefillDate)
      : new Date(0);
    const isNewDay = now.toDateString() !== lastRefill.toDateString();

    const displayCredits = isNewDay
      ? 20
      : user?.credits !== undefined
        ? user.credits
        : 20;

    res.status(200).json({
      mistakeTypeStats,
      topicStats,
      recentMistakes,
      insight: user?.latestInsight,
      suggestedProblems: user?.suggestedProblems || [],
      leetcodeStats: user?.leetcodeStats || null,
      mistakeCountAtLastInsight: user?.mistakeCountAtLastInsight || 0,
      totalMistakes,
      credits: displayCredits,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

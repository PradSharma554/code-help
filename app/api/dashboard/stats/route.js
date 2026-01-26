import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";
import mongoose from "mongoose";

import User from "@/models/User";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();
  const userId = session.user.id;

  // Fetch User for insight
  const user = await User.findById(userId).lean();
  const totalMistakes = await Mistake.countDocuments({ user: userId });

  // Aggregate stats
  const mistakeTypeStats = await Mistake.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$mistakeType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const topicStats = await Mistake.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        // Split by comma. Note: This assumes comma is the separator.
        // If users use other separators, this needs adjustment.
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

  // Check for daily refill for DISPLAY purposes only
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

  return new NextResponse(
    JSON.stringify({
      mistakeTypeStats,
      topicStats,
      recentMistakes,
      insight: user?.latestInsight,
      suggestedProblems: user?.suggestedProblems || [],
      leetcodeStats: user?.leetcodeStats || null,
      mistakeCountAtLastInsight: user?.mistakeCountAtLastInsight || 0,
      totalMistakes,
      credits: displayCredits,
    }),
    { status: 200 },
  );
}

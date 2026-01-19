import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";
import mongoose from "mongoose";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();
  const userId = session.user.id;

  // Aggregate stats
  const mistakeTypeStats = await Mistake.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$mistakeType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const topicStats = await Mistake.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$topic", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const recentMistakes = await Mistake.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  return new NextResponse(
    JSON.stringify({
      mistakeTypeStats,
      topicStats,
      recentMistakes,
    }),
    { status: 200 },
  );
}

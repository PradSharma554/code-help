import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";
import User from "@/models/User";
import {
  getRecentSubmissions,
  getProblemTags,
  getUserStats,
} from "@/lib/leetcode";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      return new NextResponse(JSON.stringify({ error: "Username required" }), {
        status: 400,
      });
    }

    // Parallel fetch: submissions and user stats
    const [recentSubmissions, userStats] = await Promise.all([
      getRecentSubmissions(username),
      getUserStats(username),
    ]);

    await connectDB();

    // Update User LeetCode Stats
    if (userStats && userStats.length > 0) {
      const total = userStats.find((s) => s.difficulty === "All")?.count || 0;
      const easy = userStats.find((s) => s.difficulty === "Easy")?.count || 0;
      const medium =
        userStats.find((s) => s.difficulty === "Medium")?.count || 0;
      const hard = userStats.find((s) => s.difficulty === "Hard")?.count || 0;

      await User.findByIdAndUpdate(
        session.user.id,
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

    // Filter failures only
    const failures = recentSubmissions.filter(
      (sub) => sub.statusDisplay !== "Accepted",
    );

    if (failures.length === 0) {
      return new NextResponse(
        JSON.stringify({
          count: 0,
          message: "Stats updated. No recent failed submissions found.",
        }),
        { status: 200 },
      );
    }

    let newEntries = 0;

    for (const sub of failures) {
      // Avoid duplicates: check if we already logged this problem recently (e.g. within 24h or simple constraint)
      // For simplicity, we check if user has a mistake logs for this problem name with the same mistake type "Synced"
      // or simply rely on problemName + createdAt approach if we had exact timestamps from LeetCode (we have UNIX timestamp)

      const submissionDate = new Date(parseInt(sub.timestamp) * 1000);

      // Check for existing synched entry for this problem/date roughly
      const exists = await Mistake.findOne({
        user: session.user.id,
        problemName: sub.title,
        createdAt: {
          // Check if created within same minute of submission to avoid duplicate sync
          $gte: new Date(submissionDate.getTime() - 60000),
          $lte: new Date(submissionDate.getTime() + 60000),
        },
      });

      if (!exists) {
        // Fetch tags for topic
        let topic = await getProblemTags(sub.titleSlug);
        if (!topic || topic.trim() === "") {
          topic = "General";
        }

        // Map status to Mistake Type
        let mistakeType = "Other";
        if (sub.statusDisplay === "Time Limit Exceeded") mistakeType = "TLE";
        else if (sub.statusDisplay === "Wrong Answer")
          mistakeType = "Wrong Approach"; // Heuristic
        else if (sub.statusDisplay === "Runtime Error")
          mistakeType = "Logic Bug";

        await Mistake.create({
          user: session.user.id,
          problemName: sub.title,
          platform: "LeetCode",
          topic: topic,
          mistakeType: mistakeType,
          reflection:
            "Auto-synced from LeetCode. Please update with your reflection.",
          codeSnippet: "",
          createdAt: submissionDate, // Backdate to actual submission time
        });
        newEntries++;
      }
    }

    return new NextResponse(
      JSON.stringify({
        count: newEntries,
        message: `Synced ${newEntries} new failed submissions.`,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Sync Error", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

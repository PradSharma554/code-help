import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select("leetcodeUsername");

  return new NextResponse(
    JSON.stringify({ username: user?.leetcodeUsername || null }),
    { status: 200 },
  );
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { username } = await req.json();
    await connectDB();

    await User.findByIdAndUpdate(
      session.user.id,
      { leetcodeUsername: username },
      { new: true },
    );

    return new NextResponse(JSON.stringify({ username }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

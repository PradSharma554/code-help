import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await req.json();
    await connectDB();

    const mistake = await Mistake.create({
      ...body,
      user: session.user.id,
    });

    return new NextResponse(JSON.stringify(mistake), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();
  const mistakes = await Mistake.find({ user: session.user.id }).sort({
    createdAt: -1,
  });

  return new NextResponse(JSON.stringify(mistakes), { status: 200 });
}

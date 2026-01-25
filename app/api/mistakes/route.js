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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";

  await connectDB();

  const query = { user: session.user.id };

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    query.$or = [{ problemName: searchRegex }, { topic: searchRegex }];
  }

  const totalCount = await Mistake.countDocuments(query);
  const mistakes = await Mistake.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return new NextResponse(
    JSON.stringify({
      mistakes,
      totalCount,
      page,
      pageSize,
    }),
    { status: 200 },
  );
}

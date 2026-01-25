import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Mistake from "@/models/Mistake";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { id } = params;
    const { reflection } = await req.json();

    if (!reflection) {
      return new NextResponse(
        JSON.stringify({ error: "Reflection is required" }),
        { status: 400 },
      );
    }

    await connectDB();

    const mistake = await Mistake.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { reflection },
      { new: true },
    );

    if (!mistake) {
      return new NextResponse(JSON.stringify({ error: "Mistake not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(mistake), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

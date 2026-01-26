import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token is required" }), {
        status: 400,
      });
    }

    await connectDB();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 400 },
      );
    }

    if (user.isVerified) {
      return new NextResponse(JSON.stringify({ message: "Already verified" }), {
        status: 200,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear token after use (optional)
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "Email verified successfully" }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

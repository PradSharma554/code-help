import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import RegistrationLog from "@/models/RegistrationLog";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    // 1. IP Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

    // Allow localhost/unknown in dev, but strictly enforce if real IP
    if (ip !== "unknown-ip" && ip !== "::1" && ip !== "127.0.0.1") {
      const registrationCount = await RegistrationLog.countDocuments({ ip });
      if (registrationCount >= 2) {
        return new NextResponse(
          JSON.stringify({
            error:
              "Too many accounts created from this IP. limit is 2 per 24h.",
          }),
          { status: 429 },
        );
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User already exists" }),
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false, // Default
    });

    // Log the registration for rate limiting
    await RegistrationLog.create({ ip, email });

    // Mock Email Sending
    const verificationLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify?token=${verificationToken}`;
    console.log("==========================================");
    console.log(`[Mock Email] Verify Account for ${email}:`);
    console.log(verificationLink);
    console.log("==========================================");

    return new NextResponse(
      JSON.stringify({
        message: "User created. Please verify your email (Check console).",
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    await connectDB();
    const { email: rawEmail } = await req.json();
    const email = rawEmail?.trim();

    console.log(`[ForgotPassword] Received request for: ${email}`);

    // Case-insensitive search
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    
    if (!user) {
      console.log(`[ForgotPassword] User not found for email: ${email}`);
      // Security: return 200 even if user not found to prevent enumeration
      return NextResponse.json(
        { message: "If a user with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }
    console.log(`[ForgotPassword] User found: ${user.email}`);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiry on user (1 hour expiry)
    user.resetPasswordToken = passwordResetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You have requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - Code Help",
        html: message,
      });

      return NextResponse.json({ message: "Email sent" }, { status: 200 });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json(
        { message: "Email could not be sent" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

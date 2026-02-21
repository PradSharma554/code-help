const User = require("../models/User");

const DAILY_CREDIT_LIMIT = 20;

async function checkAndDeductCredits(userId, cost) {
  const user = await User.findById(userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Enforce Email Verification
  if (!user.isVerified) {
    return {
      success: false,
      message: "Please verify your email address to use AI features.",
      credits: user.credits,
    };
  }

  const now = new Date();
  const lastRefill = new Date(user.lastRefillDate);

  // Check if it's a new day (simple check: different date string)
  const isNewDay = now.toDateString() !== lastRefill.toDateString();

  if (isNewDay) {
    user.credits = DAILY_CREDIT_LIMIT;
    user.lastRefillDate = now;
  }

  if (user.credits < cost) {
    return {
      success: false,
      message: "Daily quota exceeded",
      credits: user.credits,
    };
  }

  user.credits -= cost;
  await user.save();

  return { success: true, credits: user.credits };
}

module.exports = { DAILY_CREDIT_LIMIT, checkAndDeductCredits };

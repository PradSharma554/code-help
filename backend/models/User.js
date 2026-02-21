const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    latestInsight: {
      type: String,
    },
    mistakeCountAtLastInsight: {
      type: Number,
      default: 0,
    },
    leetcodeStats: {
      totalSolved: Number,
      easySolved: Number,
      mediumSolved: Number,
      hardSolved: Number,
    },
    suggestedProblems: [
      {
        problemName: String,
        difficulty: String,
        topic: String,
        link: String,
      },
    ],
    leetcodeUsername: {
      type: String,
    },
    credits: {
      type: Number,
      default: 20,
    },
    lastRefillDate: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Force re-compilation of the model if it already exists
// This avoids the "Missing Schema Field" issue in development hot-reloading
if (mongoose.models.User) {
  delete mongoose.models.User;
}

module.exports = mongoose.model("User", UserSchema);

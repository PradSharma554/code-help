import mongoose from "mongoose";

const RegistrationLogSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // Auto-delete after 24 hours (MongoDB TTL index)
    },
  },
  { timestamps: true },
);

export default mongoose.models.RegistrationLog ||
  mongoose.model("RegistrationLog", RegistrationLogSchema);

const mongoose = require("mongoose");

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

module.exports = mongoose.model("RegistrationLog", RegistrationLogSchema);

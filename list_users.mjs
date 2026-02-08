
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envConfig = dotenv.config({ path: '.env.local' }).parsed || {};
const envConfigDetails = dotenv.config({ path: '.env' }).parsed || {};
// Combine
const env = { ...envConfigDetails, ...envConfig };


const MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

// Define User Schema directly to avoid import issues
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
    // ... other fields are less relevant for listing
  },
  { timestamps: true, strict: false } // strict: false allows querying existing docs even if schema is partial
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const run = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const users = await User.find({}, 'email name');
    console.log("Users found:", users.length);
    users.forEach(u => {
      console.log(`- ${u.name} (<${u.email}>)`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

run();

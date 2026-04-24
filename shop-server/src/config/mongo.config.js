import mongoose from "mongoose";
import env from "./env.config.js";

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

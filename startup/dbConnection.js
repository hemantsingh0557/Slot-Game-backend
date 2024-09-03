import mongoose from "mongoose";
import { config } from "../config/index.js";

export async function dbConnection() {
  try {
    await mongoose.connect(config.database.url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

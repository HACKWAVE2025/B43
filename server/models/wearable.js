import mongoose from "mongoose";

const wearableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  raw: Object,
  normalizedFeatures: Object,
  source: { type: String, default: "manual" },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Wearable", wearableSchema);

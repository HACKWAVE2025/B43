import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  classifier: String,
  regressor: Number,
  combinedScore: Number,
  inputFeatures: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Prediction", predictionSchema);

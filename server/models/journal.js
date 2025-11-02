// models/Journal.js
import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  three_good_things: { type: [String], default: [] },
  sentiment: { type: Number }, // optional, computed later
  suicidality_check: { type: Object }, // raw HF output
  createdAt: { type: Date, default: Date.now }
});
journalSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Journal', journalSchema);

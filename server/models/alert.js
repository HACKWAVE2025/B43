// models/Alert.js
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['suicidality','high_stress','emergency'], required: true },
  details: Object,
  acknowledged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
alertSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);

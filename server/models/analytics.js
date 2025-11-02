// models/Analytics.js
import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  // store aggregated snapshot for admin dashboards
  periodStart: Date,
  periodEnd: Date,
  cohort: String, // e.g., 'all', 'female', 'batch-2025'
  metrics: Object, // e.g., { avg_combined_score: 1.7, todo_completion_rate: 0.45, avg_sleep: 6.8 }
  createdAt: { type: Date, default: Date.now }
});

analyticsSchema.index({ periodStart: 1, cohort: 1 });

export default mongoose.model('Analytics', analyticsSchema);

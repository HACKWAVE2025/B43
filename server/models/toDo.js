// models/Todo.js
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  rationale: String,
  action: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
todoSchema.index({ user: 1, completed: 1, createdAt: -1 });

export default mongoose.model('Todo', todoSchema);

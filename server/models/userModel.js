import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, sparse: true },
    gender: { type: Number, enum: [0, 1], default: 0 },
    phone: String,
    isDisabled: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
        enum: ['user', 'admin'],
        default: ['user'],
    },
    profile: profileSchema,
    survey: {
        anxiety_level: { type: Number, default: 0 },
        mental_health_history: { type: Number, default: 0 },
        headache: { type: Number, default: 0 },
        academic_performance: { type: Number, default: 0 },
        financial_condition: { type: String, enum: ['yes','no','unknown'], default: 'unknown' },
        safety: { type: Number, default: 0 },
        extracurricular_activities: { type: Number, default: 0 },
        gender: { type: Number, enum: [0,1], default: 0 },
    },
    cgpa: {
        type: Number,
        min: 0,
        max: 10,
    },
    extracurricularActivities: {
        type: [String],
        default: [],
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

// models/User.js





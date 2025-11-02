import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wearableRoutes from "./routes/wearable.js";

dotenv.config();

// Database connection
dbConnect();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wearable", wearableRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

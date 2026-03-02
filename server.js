import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import booking from "./routes/booking.js";

// 🔥 FORCE LOAD ENV FILE (IMPORTANT FOR ESM)
dotenv.config({ path: "./.env" });

// 🔥 Debug (Remove after testing)
console.log("OPENAI KEY LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/booking",booking);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);

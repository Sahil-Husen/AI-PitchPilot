import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";
import {
  globalLimiter,
  authLimiter,
  aiLimiter,
} from "./middleware/rateLimitter.js";

const PORT = process.env.PORT || 3000;

// fetch ENV variables
dotenv.config();

//db connectiion
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// applying Global rate limiter to prevent malicious requests and security breaches
app.use(globalLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.listen(PORT, () => {
  console.log("Server is running on PORT ", PORT);
});

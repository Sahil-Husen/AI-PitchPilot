import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const PORT = process.env.PORT || 3000;
import authRoutes from "./routes/authRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";

// fetch ENV variables
dotenv.config();

//db connectiion
connectDB();

const app = express();
app.use(cors()); 
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/ai", aiRoutes);
app.listen(PORT, () => {
  console.log("Server is running on PORT ", PORT);
});

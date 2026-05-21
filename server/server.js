import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path'
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
app.set('trust proxy', 1) 

app.use(cors({
  origin: "https://ai-pitch-pilot-9acr.vercel.app"  // exact Vercel URL
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// applying Global rate limiter to prevent malicious requests and security breaches
app.use(globalLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);


// absolute path to build client folder
// const __dirnamePath = path.resolve();
// const clientBuildPath = path.join(__dirnamePath,'client','dist');
// app.use(express.static(clientBuildPath))

// //for any route not starting with /api redirect to index.html

// app.get('*splat', (req, res) => {
//   if (!req.path.startsWith('/api')) {
//     res.sendFile(path.join(clientBuildPath, 'index.html'))
//   }
// })


app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({
    message:"Server error",
    error:err.message
  })
})

app.listen(PORT, () => {
  console.log("Server is running on PORT ", PORT);
});

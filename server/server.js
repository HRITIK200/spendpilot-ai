import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import reportRoutes from "./routes/reportRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();

const app = express();

const apiLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

  message:
    "Too many requests. Please try again later.",
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://spendpilot-ai-sandy.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.send("SpendPilot AI Backend Running");
});

app.use("/api/reports", reportRoutes);

app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  })
  .catch((err) => {
    console.log(err);
  });
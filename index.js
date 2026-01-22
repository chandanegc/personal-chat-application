import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { chatAgent } from "./agent.js";
import { connectDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});


app.post("/api/chat", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required" });
  }

  try {
    const reply = await chatAgent(userId, message);
    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Production server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
// Backend test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Buddy AI Backend is running!",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = Number(process.env.PORT) || 5000;

    const server = app.listen(PORT, "127.0.0.1", () => {
      console.log(`Buddy server running on http://127.0.0.1:${PORT}`);
      console.log("Server listening:", server.listening);
      console.log("Server address:", server.address());
    });

    server.on("error", (error) => {
      console.error("HTTP server error:", error);
    });

    server.on("close", () => {
      console.log("HTTP server closed unexpectedly!");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();


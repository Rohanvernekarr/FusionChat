const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: ["https://fusion-chat-pink.vercel.app"], // Deployed frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Fusion Chat Backend is Running!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Ping Route (Debugging)
app.get("/ping", (_req, res) => {
  return res.json({ msg: "✅ Ping Successful" });
});

// Dynamic Port for Render Deployment
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// Setup Socket.IO
const io = socket(server, {
  cors: {
    origin: ["https://fusion-chat-pink.vercel.app"], // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

// Socket.IO Event Handling
io.on("connection", (socket) => {
  console.log(`🔵 New Socket Connected: ${socket.id}`);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User Added: ${userId}, Socket ID: ${socket.id}`);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", {
        message: data.message,
        timestamp: data.timestamp,
      });
      console.log(`📩 Message Sent to ${data.to}`);
    } else {
      console.log(`⚠️ User ${data.to} is not online`);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`🔴 User Disconnected: ${userId}`);
        break;
      }
    }
  });
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(4000, () =>
  console.log(`Server started on 4000`)
).on("error", (err) => {
  console.error("Server error:", err);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    
  });

  socket.on("send-msg", (data) => {
   
    const sendUserSocket = onlineUsers.get(data.to);
    
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", {
        message: data.message,
        timestamp: data.timestamp
      });
    }
  });

  socket.on("disconnect", () => {
    // Remove user from online users when they disconnect
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});
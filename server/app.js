const express = require('express');
const cors = require('cors');
const http = require('http')
const {Server} = require('socket.io')
const mongoose = require('mongoose');
const app = express();
const userRoutes = require("./routes/messages.js")
require('dotenv').config();

const server = http.createServer(app)
const io = new Server(server)

const PORT =5000;
const MONGO_URL ="mongodb://localhost:27017/chat"

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)

// Connect to MongoDB
mongoose.connect(MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

app.get('/', (req, res) => {
    res.send('Chat server is running!');
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Broadcast messages
    socket.on('chatMessage', async (data) => {
      const newMessage = new Message({ username: data.username, message: data.message });
      await newMessage.save();
      io.emit('chatMessage', newMessage);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});

// Start the server
const chatapp = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

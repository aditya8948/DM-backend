require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const routes = require('./routes');
const db = require('./models');
const { ChatService } = require('./services');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// REST API routes
app.use('/api', routes);

// Socket.IO real-time connection handler
io.on('connection', (socket) => {
  console.log('Socket client connected:', socket.id);

  // Each user joins their own private room (e.g. user_1, user_2)
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  // Handle incoming message
  socket.on('send_message', async (data, callback) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        if (callback) callback({ error: 'Missing required fields' });
        return;
      }

      // 1. Save to MySQL database
      const savedMessage = await ChatService.sendMessage({
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        message
      });

      // 2. Real-time broadcast to both receiver and sender
      io.to(`user_${receiverId}`).emit('receive_message', savedMessage);
      io.to(`user_${senderId}`).emit('receive_message', savedMessage);

      if (callback) callback({ status: 'ok', data: savedMessage });
    } catch (err) {
      console.error('Socket message error:', err);
      if (callback) callback({ error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket client disconnected:', socket.id);
  });
});

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to MySQL via Sequelize');

    await db.sequelize.sync();
    console.log('Sequelize models synchronized');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with Socket.IO enabled`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

startServer();

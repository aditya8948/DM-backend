const { ChatService } = require('../../services');

module.exports = (io, socket) => {
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on('send_message', async (data, callback) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        if (callback) callback({ error: 'Missing required fields' });
        return;
      }

      const savedMessage = await ChatService.sendMessage({
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        message
      });

      io.to(`user_${receiverId}`).emit('receive_message', savedMessage);
      io.to(`user_${senderId}`).emit('receive_message', savedMessage);

      if (callback) callback({ status: 'ok', data: savedMessage });
    } catch (err) {
      console.error('Socket message error:', err);
      if (callback) callback({ error: err.message });
    }
  });
};

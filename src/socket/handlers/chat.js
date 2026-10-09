const { ChatService } = require('../../services');

const getPersonalRoomId = (user1, user2) => {
  const u1 = Number(user1);
  const u2 = Number(user2);
  return `room_${Math.min(u1, u2)}_${Math.max(u1, u2)}`;
};

module.exports = (io, socket) => {
  socket.on('join_personal_room', ({ userId, receiverId }) => {
    const roomId = getPersonalRoomId(userId, receiverId);
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined personal room: ${roomId}`);
  });

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
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

      const roomId = getPersonalRoomId(senderId, receiverId);
      io.to(roomId).emit('receive_message', savedMessage);

      if (callback) callback({ status: 'ok', data: savedMessage });
    } catch (err) {
      console.error('Socket message error:', err);
      if (callback) callback({ error: err.message });
    }
  });
};

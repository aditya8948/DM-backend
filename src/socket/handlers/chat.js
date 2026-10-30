const { ChatService } = require('../../services');

const getPersonalRoomId = (user1, user2) => {
  const u1 = Number(user1);
  const u2 = Number(user2);
  return `room_${Math.min(u1, u2)}_${Math.max(u1, u2)}`;
};

module.exports = (io, socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on('join_personal_room', ({ userId, receiverId }) => {
    const roomId = getPersonalRoomId(userId, receiverId);
    socket.join(roomId);
  });

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('send_message', async (data, callback) => {
    try {
      const { senderId, receiverId, message, roomId } = data;

      if ((!message && !data.fileUrl) || (!roomId && (!senderId || !receiverId))) {
        if (callback) callback({ error: 'Missing required fields' });
        return;
      }

      let savedMessage = null;
      if (senderId && receiverId && message) {
        try {
          savedMessage = await ChatService.sendMessage({
            senderId: Number(senderId),
            receiverId: Number(receiverId),
            message
          });
        } catch (e) {
          console.error(e);
        }
      }

      const targetRoom = roomId || getPersonalRoomId(senderId, receiverId);
      const payload = savedMessage ? {
        id: savedMessage.id,
        senderId: savedMessage.senderId,
        receiverId: savedMessage.receiverId,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
        senderName: data.senderName || null,
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        fileType: data.fileType || null
      } : {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        senderId,
        senderName: data.senderName || null,
        receiverId: receiverId ? Number(receiverId) : null,
        message: message || '',
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        fileType: data.fileType || null,
        createdAt: new Date()
      };

      io.to(targetRoom).emit('new_message', payload);

      if (callback) callback({ status: 'ok', data: payload });
    } catch (err) {
      console.error('Socket message error:', err);
      if (callback) callback({ error: err.message });
    }
  });
};

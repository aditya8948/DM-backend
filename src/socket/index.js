const { Server } = require('socket.io');
const { socketAuthMiddleware } = require('./middleware');
const registerChatHandlers = require('./handlers/chat');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log('Socket client connected:', socket.id);

    registerChatHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('Socket client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initSocket;

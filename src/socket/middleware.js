const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_key');
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};

module.exports = {
  socketAuthMiddleware
};

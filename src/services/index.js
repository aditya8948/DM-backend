const AuthService = require('./authservices');
const ChatService = require('./chatService');

module.exports = {
  AuthService: new AuthService(),
  ChatService: new ChatService()
};

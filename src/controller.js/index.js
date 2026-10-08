const AuthController = require('./authcontroller');
const ChatController = require('./chatController');

module.exports = {
  AuthController: new AuthController(),
  ChatController: new ChatController()
};

const UserRepository = require('./userRepository');
const MessageRepository = require('./messageRepository');

module.exports = {
  UserRepository: new UserRepository(),
  MessageRepository: new MessageRepository()
};

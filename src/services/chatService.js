const { MessageRepository } = require('../repository');

class ChatService {
  async sendMessage({ senderId, receiverId, message }) {
    if (!message || !message.trim()) {
      const error = new Error('Message cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    return await MessageRepository.create({
      senderId,
      receiverId,
      message: message.trim()
    });
  }

  async getMessage(user1Id, user2Id) {
    return await MessageRepository.getConversation(user1Id, user2Id);
  }
}

module.exports = ChatService;

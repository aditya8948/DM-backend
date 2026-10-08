const { Message, Sequelize } = require('../models');
const { Op } = Sequelize;

class MessageRepository {
  async create({ senderId, receiverId, message }) {
    return await Message.create({ senderId, receiverId, message });
  }

  async getConversation(user1Id, user2Id) {
    return await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
  }
}

module.exports = MessageRepository;

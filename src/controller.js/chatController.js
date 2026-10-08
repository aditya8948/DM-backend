const { ChatService } = require('../services');
const { UserRepository } = require('../repository');

class ChatController {
  async sendMessage(req, res) {
    try {
      const senderId = req.user.userId;
      const { receiverId, message } = req.body;

      if (!receiverId) {
        return res.status(400).json({ error: 'receiverId is required' });
      }

      // Check if receiver exists in the database
      const receiver = await UserRepository.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({
          error: `User ID ${receiverId} does not exist yet. Please register a 2nd user via signup.html to chat with!`
        });
      }

      const savedMessage = await ChatService.sendMessage({
        senderId,
        receiverId,
        message
      });

      return res.status(201).json({
        message: 'Message sent successfully',
        data: savedMessage
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
      });
    }
  }

  async getMessage(req, res) {
    try {
      const currentUserId = req.user.userId;
      const { receiverId } = req.params;

      const message = await ChatService.getMessage(currentUserId, receiverId);

      return res.status(200).json({
        data: message
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = ChatController;

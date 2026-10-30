const { ChatService, S3Service } = require('../services');
const { UserRepository } = require('../repository');

class ChatController {
  async sendMessage(req, res) {
    try {
      const senderId = req.user.userId;
      const { receiverId, message } = req.body;

      if (!receiverId) {
        return res.status(400).json({ error: 'receiverId is required' });
      }

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

  async uploadMedia(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No media file provided' });
      }

      const senderId = req.user.userId;
      const { roomId, receiverId, message } = req.body;
      const sender = await UserRepository.findById(senderId);
      const senderName = sender ? sender.name : 'User';

      const uploadResult = await S3Service.uploadFile(req.file);

      const payload = {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        senderId,
        senderName,
        receiverId: receiverId ? Number(receiverId) : null,
        message: message || '',
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        createdAt: new Date()
      };

      const io = req.app.get('io');
      if (io && roomId) {
        io.to(roomId).emit('new_message', payload);
      }

      return res.status(200).json({
        message: 'File uploaded successfully',
        data: payload
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to upload media'
      });
    }
  }
}

module.exports = ChatController;

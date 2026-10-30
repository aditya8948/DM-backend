const AuthService = require('./authservices');
const ChatService = require('./chatService');
const S3Service = require('./s3Service');

module.exports = {
  AuthService: new AuthService(),
  ChatService: new ChatService(),
  S3Service
};

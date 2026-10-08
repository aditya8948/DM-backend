const express = require('express');
const router = express.Router();

const { AuthController, ChatController } = require('../../controller.js');
const { authMiddleware } = require('../../middleware');

// Auth routes
router.post('/signup', (req, res) => AuthController.signup(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));

// Chat routes (Protected by JWT)
router.post('/messages', authMiddleware, (req, res) => ChatController.sendMessage(req, res));
router.get('/messages/:receiverId', authMiddleware, (req, res) => ChatController.getMessage(req, res));

module.exports = router;

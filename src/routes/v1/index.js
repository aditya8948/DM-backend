const express = require('express');
const multer = require('multer');
const router = express.Router();

const { AuthController, ChatController } = require('../../controller.js');
const { authMiddleware } = require('../../middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

router.post('/signup', (req, res) => AuthController.signup(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));
router.get('/users', authMiddleware, (req, res) => AuthController.getUsers(req, res));

router.post('/messages', authMiddleware, (req, res) => ChatController.sendMessage(req, res));
router.get('/messages/:receiverId', authMiddleware, (req, res) => ChatController.getMessage(req, res));
router.post('/messages/upload', authMiddleware, upload.single('media'), (req, res) => ChatController.uploadMedia(req, res));

module.exports = router;

const express = require('express');
const router = express.Router();
const TelegramMessagesController = require('../../controllers/telegram/messages');

router.post('/sendPhoto', TelegramMessagesController.sendPhoto);
router.post('/editMessageMedia', TelegramMessagesController.editMessageMedia);
router.post('/sendMessage', TelegramMessagesController.sendMessage);
router.post('/editMessageText', TelegramMessagesController.editMessageText);
router.post('/deleteMessage', TelegramMessagesController.deleteMessage);

module.exports = router;
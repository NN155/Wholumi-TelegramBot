const express = require('express');
const router = express.Router();
const { TelegramController } = require('../controllers');

router.post('/sendPhoto', TelegramController.sendPhoto);
router.post('/editMessageMedia', TelegramController.editMessageMedia);
router.post('/sendMessage', TelegramController.sendMessage);
router.post('/editMessageText', TelegramController.editMessageText);
router.post('/deleteMessage', TelegramController.deleteMessage);
router.post('/sendCoupleMessages', TelegramController.sendCoupleMessages);

module.exports = router;
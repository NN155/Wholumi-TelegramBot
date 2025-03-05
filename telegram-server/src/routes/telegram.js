const express = require('express');
const router = express.Router();
const { TelegramController } = require('../controllers');
const validate = require('../middlewares/telegram/validate');

router.post('/sendPhoto', validate.sendPhoto, TelegramController.sendPhoto);
router.post('/editMessageMedia',validate.editMessageMedia, TelegramController.editMessageMedia);
router.post('/sendMessage',validate.sendMessage, TelegramController.sendMessage);
router.post('/editMessageText',validate.editMessageText, TelegramController.editMessageText);
router.post('/deleteMessage',validate.deleteMessage, TelegramController.deleteMessage);
router.post('/sendCoupleMessages',validate.sendCoupleMessages, TelegramController.sendCoupleMessages);

module.exports = router;
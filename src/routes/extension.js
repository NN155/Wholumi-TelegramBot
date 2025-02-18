const express = require('express');
const router = express.Router();
const { TelegramController } = require('../controllers');

router.post('/newTrade', ExtensionController.personalTrade);

module.exports = router;
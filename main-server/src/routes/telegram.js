const express = require('express');
const router = express.Router();
const { TelegramController } = require('../controllers');

router.post('/searchCards', TelegramController.searchCards);

module.exports = router;
const express = require('express');
const router = express.Router();
const { ExtensionController } = require('../controllers');

router.post('/club/daily/boost', ExtensionController.dailyBoost);
module.exports = router;
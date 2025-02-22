const express = require('express');
const router = express.Router();
const { ExtensionController } = require('../controllers');

router.post('/newTrade', ExtensionController.personalTrade);
router.post('/club/daily/boost', ExtensionController.clubDailyBoost);
router.post('/club/daily/skipped', ExtensionController.clubDailySkipped);

module.exports = router;
const express = require('express');
const router = express.Router();
const { ExtensionController } = require('../controllers');

router.post('/club/boost', ExtensionController.dailyBoost);
router.post('/club/skipped', ExtensionController.dailySkipped);

module.exports = router;
const express = require('express');
const router = express.Router();
const { ClubController } = require('../controllers');

router.post('/daily/boost', ClubController.dailyBoost);
router.post('/daily/skipped', ClubController.dailySkipped);

module.exports = router;
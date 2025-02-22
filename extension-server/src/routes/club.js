const express = require('express');
const router = express.Router();
const { ClubController } = require('../controllers');

router.post('/daily/boost', ClubController.dailyBoost);

module.exports = router;
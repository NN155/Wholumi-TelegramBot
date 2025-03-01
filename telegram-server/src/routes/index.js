const express = require('express');
const router = express.Router();
const telegramRouter = require('./telegram');

router.use('/telegram', telegramRouter);

module.exports = router;
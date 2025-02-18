const express = require('express');
const router = express.Router();
const telegramRouter = require('./telegram');
const extensionRouter = require('./extension');

router.use('/webhook', telegramRouter);
router.use('/extension', extensionRouter);

module.exports = router;






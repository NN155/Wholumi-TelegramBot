const express = require('express');
const router = express.Router();
const telegramRouter = require('./telegram');
const extensionRouter = require('./extension');
//const telegramRoutes = require('./telegram');
//const telegramMessagesRoutes = require('./telegram/messages');
//router.use('/api/telegram', telegramRoutes);
//router.use('/api/telegram/messages', telegramMessagesRoutes);
router.use('/webhook', telegramRouter);
router.use('/extension', extensionRouter);
module.exports = router;






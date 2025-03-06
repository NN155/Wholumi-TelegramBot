const express = require('express');
const router = express.Router();
const extensionRouter = require('./extension');
const telegramRouter = require('./telegram');
const actionRouter = require('./action');

router.use('/extension', extensionRouter);
router.use('/telegram', telegramRouter);
router.use('/action', actionRouter);

module.exports = router;
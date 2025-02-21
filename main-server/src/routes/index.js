const express = require('express');
const router = express.Router();
const extensionRouter = require('./extension');

router.use('/extension', extensionRouter);

module.exports = router;
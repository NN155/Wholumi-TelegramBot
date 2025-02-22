const express = require('express');
const router = express.Router();
const clubRouter = require('./club');

router.use('/club', clubRouter);

module.exports = router;
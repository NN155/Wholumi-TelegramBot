const express = require('express');
const router = express.Router();
const clubRouter = require('./club');
const actionRouter = require('./action');

router.use('/club', clubRouter);
router.use('/action', actionRouter);

module.exports = router;
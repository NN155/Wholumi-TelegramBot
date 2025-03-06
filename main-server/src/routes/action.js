const express = require('express');
const router = express.Router();
const { ActionController } = require('../controllers');

router.post('/results', ActionController.results);

module.exports = router;
const express = require('express');
const router = express.Router();
const { ActionController } = require('../controllers');

router.post('/', ActionController.proccessAction);

module.exports = router;
const express = require('express');
const router = express.Router();
const { ActionController } = require('../controllers');

router.post('/', ActionController.proccessAction);
router.post('/result', ActionController.sendResponse);

module.exports = router;
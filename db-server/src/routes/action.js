const express = require('express');
const router = express.Router();
const { ActionController } = require('../controllers');
const ActionMiddleware = require('../middlewares/action');

router.post('/userAccess', ActionMiddleware.validate.userAccess, ActionController.userAccess);
router.post('/ban', ActionMiddleware.validate.ban, ActionController.ban);
router.post('/unban', ActionMiddleware.validate.unban, ActionController.unban);
router.post('/status', ActionMiddleware.validate.status, ActionController.status);

module.exports = router;
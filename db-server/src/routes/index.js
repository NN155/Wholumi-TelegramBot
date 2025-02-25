const express = require('express');
const router = express.Router();
const { DBController } = require('../controllers');

router.get('/users', DBController.getUsers);
router.get('/user', DBController.getUser);
router.get('/chats', DBController.getChats);
router.get('/chat', DBController.getChat);

module.exports = router;
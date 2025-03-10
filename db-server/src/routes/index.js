const express = require('express');
const router = express.Router();
const { DBController } = require('../controllers');
const actionRouter = require('./action');


router.get('/users', DBController.getUsers);
router.get('/user', DBController.getUser);
router.get('/chats', DBController.getChats);
router.get('/chat', DBController.getChat);
router.get('/options', DBController.getOptions);
router.get('/option', DBController.getOption);
router.get('/images', DBController.getImages);
router.get('/image', DBController.getImage);

router.use("/action", actionRouter);

module.exports = router;
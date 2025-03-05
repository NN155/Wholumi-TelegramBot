const { DBService } = require('../../services'); 

class DBController {
    getUsers(req, res) {
        const users = DBService.users.getAll();
        res.json(users);
    }
    getUser(req, res) {
        const user = DBService.users.findOne(req.query);
        res.json(user);
    }
    getChats(req, res) {
        const chats = DBService.chats.getAll();
        res.json(chats);
    }
    getChat(req, res) {
        const chat = DBService.chats.findOne(req.query);
        res.json(chat);
    }
    getOptions(req, res) {
        const options = DBService.options.getAll();
        res.json(options);
    }
    getOption(req, res) {
        const option = DBService.options.findOne(req.query);
        res.json(option);
    }
    getImages(req, res) {
        const images = DBService.images.getAll();
        res.json(images);
    }
    getImage(req, res) {
        const image = DBService.images.findOne(req.query);
        res.json(image);
    }
}

module.exports = new DBController();
const { DBService } = require('../../services'); 

class DBController {
    getUsers(req, res) {
        const users = DBService.users.getAll();
        res.json(users);
    }
    getUser(req, res) {
        const user = DBService.users.findOne(req.params);
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
}

module.exports = new DBController();
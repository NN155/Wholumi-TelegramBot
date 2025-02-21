const { ExtensionService, UsersService, TelegramService } = require('../../services');

class ExtensionController {
    async dailyBoost(req, res) {
        try {
            const users = await UsersService.getAll();
            const message = ExtensionService.Club.dailyBoost({...req.body, users});
            await TelegramService.Club.dailyBoost(message);
            return res.status(200).send(message);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ExtensionController();
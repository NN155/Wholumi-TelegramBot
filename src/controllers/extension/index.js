const { TelegramService } = require('../../services');

class ExtensionController {
    async personalTrade(req, res) {
        try {
            await TelegramService.Personal.NewTrade(req.body);
            return res.status(201).json(chat);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ExtensionController();
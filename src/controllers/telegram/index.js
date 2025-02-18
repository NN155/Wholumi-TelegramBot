const { TelegramService } = require('../../services');
class TelegramController {
    async newTrade(req, res) {

        try {
            await TelegramService.newTrade(req.body);
            return res.status(201).json(chat);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new TelegramController();
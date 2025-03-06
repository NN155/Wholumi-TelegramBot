const { UsersService, TelegramService } = require('../../services');

class ExtensionController {
    async dailyBoost(req, res) {
        try {
            const users = await UsersService.getAll();
            const message = await TelegramService.Club.dailyBoost({ ...req.body, users });
            return res.status(200).send(message);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async dailySkipped(req, res) {
        try {
            const pageUrl = await TelegramService.Club.dailySkipped(req.body);
            return res.status(200).json({ pageUrl });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ error: error.message });
        }

    }
}

module.exports = new ExtensionController();
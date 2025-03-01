const { TelegramService } = require('../../services');

class TelegramController {
    async sendPhoto(req, res) {
        try {
            const response = await TelegramService.sendPhoto(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editMessageMedia(req, res) {
        try {
            const response = await TelegramService.editMessageMedia(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async sendMessage(req, res) {
        try {
            const response = await TelegramService.sendMessage(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editMessageText(req, res) {
        try {
            const response = await TelegramService.editMessageText(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteMessage(req, res) {
        try {
            const response = await TelegramService.deleteMessage(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async sendCoupleMessages(req, res) {
        try {
            const response = await TelegramService.sendCoupleMessages(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TelegramController();
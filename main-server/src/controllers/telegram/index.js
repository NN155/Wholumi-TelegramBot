const { ActionService } = require('../../services');

class TelegramController {
    async searchCards(req, res) {
        try {
            const { messageData, action } = req.body;
            await ActionService.searchCards({
                chatId: messageData.chatId,
                threadId: messageData.threadId,
                messageId: messageData.messageId,
                action,
            });
            return res.sendStatus(204);
        }
        catch (error) {
            console.error('searchCards:', error);
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new TelegramController();
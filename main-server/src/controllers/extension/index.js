const { ExtensionService, UsersService, TelegramService } = require('../../services');

class ExtensionController {
    async dailyBoost(req, res) {
        try {
            const users = await UsersService.getAll();
            const message = ExtensionService.Club.dailyBoost({ ...req.body, users });
            await TelegramService.Club.dailyBoost(message);
            return res.status(200).send(message);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async dailySkipped(req, res) {
        try {
            const response = await fetch('https://okimoto.wishmc.com.ua/generate.php', {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();

            console.log('Server response:', data.pageUrl);
            await fetch(`${process.env.TELEGRAM_SERVER_URL}/extension/club/daily/skipped`, {
                method: 'POST',
                body: JSON.stringify({
                    pageUrl: data.pageUrl, 
                    chatId: process.env.SKIPPED_CHAT_ID, 
                    threadId: process.env.SKIPPED_THREAD_ID
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return res.status(200).send(data.pageUrl);
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ error: error.message });
        }

    }
}

module.exports = new ExtensionController();
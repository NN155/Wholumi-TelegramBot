const express = require('express');
const router = express.Router();
const TelegramService = require('../services/telegram/index.js');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

router.post('/extension/newTrade', async (req, res) => {
    try {
        console.log('Получен новый трейд:', req.body);
        await TelegramService.newTrade(req.body);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Ошибка обработки трейда:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    if (req.body.callback_query) {
        const action = req.body.callback_query.data;
        const tradeInfo = JSON.parse(action);

        if (extensionConnection) {
            if (tradeInfo.mod === 'trades' && tradeInfo.action === 'accept') {
                console.log(`✅ Принят обмен: ${tradeInfo.id}`);
                try {
                    extensionConnection.send(JSON.stringify({
                        action: 'confirm',
                        tradeId: tradeInfo.id
                    }));
                } catch (error) {
                    console.error('Error sending command to extension:', error);
                }
            } else if (tradeInfo.mod === 'trades' && tradeInfo.action === 'reject') {
                console.log(`❌ Отклонен обмен: ${tradeInfo.id}`);
                try {
                    extensionConnection.send(JSON.stringify({
                        action: 'cancel',
                        tradeId: tradeInfo.id
                    }));
                } catch (error) {
                    console.error('Error sending command to extension:', error);
                }
            }
        } else {
            console.log('Extension not connected');
        }

        await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                callback_query_id: req.body.callback_query.id,
                text: extensionConnection ? "✅ Действие выполнено!" : "❌ Расширение не подключено",
                show_alert: !extensionConnection
            })
        });
        

        return res.sendStatus(200);
    }
    res.sendStatus(200);
});

module.exports = router;
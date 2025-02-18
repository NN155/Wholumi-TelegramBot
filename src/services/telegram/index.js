const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

class TelegramService {
    
    async newTrade(trade) {
        try {
            console.log(trade);
            const { myCard, tradeCard, tradeId } = trade;
            const message = `Предлагают: ${tradeCard.popularity} желающих\nОтдаем: ${myCard.popularity} желающих\nВыберите действие с обменом:`;

            console.log("📢 Начинаем загрузку изображений...");

            const mediaUrls = [
                `https://animestars.org${tradeCard.src}`,
                `https://animestars.org${myCard.src}`
            ];

            console.log("✅ Изображения загружены.");

            const mediaGroupResponse = await this.sendMediaGroup(mediaUrls);

            console.log("📩 Ответ от Telegram (медиа-группа):", mediaGroupResponse.data);

            console.log("✅ Медиа-группа успешно отправлена!");

            const replyMarkup = {
                inline_keyboard: [
                    [
                        { text: "✅ Принять обмен", callback_data: JSON.stringify({mod: "trades", action: "accept", id: tradeId}) },
                        { text: "❌ Отклонить обмен", callback_data: JSON.stringify({mod: "trades", action: "reject", id: tradeId}) }
                    ]
                ]
            };

            console.log("📤 Отправляем сообщение с кнопками...");

            const textResult = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                reply_markup: replyMarkup
            });

            console.log("📩 Ответ от Telegram (сообщение):", textResult.data);
        } catch (error) {
            console.error("❌ Ошибка в TelegramService.newTrade:", error);
        }
    }

    async sendMediaGroup(mediaUrls) {
        const form = new FormData();
        form.append("chat_id", TELEGRAM_CHAT_ID);

        const mediaArray = mediaUrls.map(url => ({
            type: 'photo', 
            media: url     
        }));

        form.append("media", JSON.stringify(mediaArray));
    
        try {
            const response = await axios.post(`${TELEGRAM_API_URL}/sendMediaGroup`, form, {
                headers: {
                    ...form.getHeaders(),
                },
            });
    
            return response;
        } catch (error) {
            console.error("❌ Ошибка отправки медиа группы:", error);
            throw new Error("Error sending media group to Telegram.");
        }
    }
}

module.exports = new TelegramService();

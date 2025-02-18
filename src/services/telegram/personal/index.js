const axios = require("axios");
const FormData = require("form-data");

class Personal {
    constructor() {
        this.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        this.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        this.TELEGRAM_API_URL = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}`;
    }
    async NewTrade(trade) {
        const { myCard, tradeCard, tradeId } = trade;
        const message = `Предлагают: ${tradeCard.popularity} желающих\nОтдаем: ${myCard.popularity} желающих\nВыберите действие с обменом:`;

        console.log("📢 Начинаем загрузку изображений...");

        const mediaUrls = [
            `https://animestars.org${tradeCard.src}`,
            `https://animestars.org${myCard.src}`
        ];

        console.log("✅ Изображения загружены.");

        const mediaGroupResponse = await this._sendMediaGroup(mediaUrls);

        console.log("📩 Ответ от Telegram (медиа-группа):", mediaGroupResponse.data);

        console.log("✅ Медиа-группа успешно отправлена!");

        const replyMarkup = {
            inline_keyboard: [
                [
                    { text: "✅ Принять обмен", callback_data: JSON.stringify({ mod: "trades", action: "accept", id: tradeId }) },
                    { text: "❌ Отклонить обмен", callback_data: JSON.stringify({ mod: "trades", action: "reject", id: tradeId }) }
                ]
            ]
        };

        console.log("📤 Отправляем сообщение с кнопками...");

        const textResult = await axios.post(`${this.TELEGRAM_API_URL}/sendMessage`, {
            chat_id: this.TELEGRAM_CHAT_ID,
            text: message,
            reply_markup: replyMarkup
        });
    }

    async _sendMediaGroup(mediaUrls) {
        const form = new FormData();
        form.append("chat_id", this.TELEGRAM_CHAT_ID);

        const mediaArray = mediaUrls.map(url => ({
            type: 'photo',
            media: url
        }));

        form.append("media", JSON.stringify(mediaArray));

        const response = await axios.post(`${this.TELEGRAM_API_URL}/sendMediaGroup`, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        return response;
    }
}

module.exports = new Personal();

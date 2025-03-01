const bot = require('../../bot/telegramBot');

class TelegramService {

    async sendPhoto({ chatId, threadId = null, photoUrl, caption = "" , replyToMessageId = null }) {
        const sentMessage = await bot.sendPhoto(chatId, photoUrl, {
            message_thread_id: threadId,
            caption: caption,
            reply_to_message_id: replyToMessageId,
        })
        return sentMessage;
    }

    async editMessageMedia({photoUrl, caption, messageId, chatId}) {
        const media = {
            type: 'photo',
            media: photoUrl,
            caption: caption,
        };

        const options = {
            chat_id: chatId,
            message_id: messageId,
        };

        const sentMessage = await bot.editMessageMedia(media, options);
        return sentMessage;
    }

    async sendMessage({ chatId, text, threadId = null, replyToMessageId = null }) {
        const sentMessage = await bot.sendMessage(chatId, text, {
            message_thread_id: threadId,
            reply_to_message_id: replyToMessageId,
        })
        return sentMessage;
    }

    async editMessageText({ chatId, text, messageId }) {
        const sentMessage = await bot.editMessageText(text, {
            message_id: messageId,
            chat_id: chatId,
        })
        return sentMessage;
    }

    async deleteMessage({chatId, messageId} ) {
        const sentMessage = await bot.deleteMessage(chatId, messageId);
        return sentMessage;
    }
    async replyMessage(text, messageId) {
        try {

            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_thread_id: this.TELEGRAM_THREAD_ID,
                text: text,
                reply_to_message_id: messageId
            };

            await axios.post(`${this.TELEGRAM_API_URL}/sendMessage`, data);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
    async sendCoupleMessages({ chatId, threadId = null, photoUrl, caption = "" , replyToMessageId = null }) {
        const MessagesResponse = [];
        const messages = this._split(caption);
        for (let i = 0; i < messages.length; i++) {
            if (i === 0) {
                const response = await this.sendPhoto({ chatId, threadId, photoUrl, caption: messages[i], replyToMessageId });
                MessagesResponse.push(response);
                continue;
            }
            const response = await this.sendMessage({ chatId, text: messages[i], threadId, replyToMessageId });
            MessagesResponse.push(response);
        }
        return MessagesResponse;
    }

    _split(text, firstMessageLimit = 1024, otherMessagesLimit = 4096) {
        if (!text) return [""];
        
        const result = [];
        let currentText = text;
        let isFirstMessage = true;
        
        while (currentText.length > 0) {
            const currentLimit = isFirstMessage ? firstMessageLimit : otherMessagesLimit;
            
            if (currentText.length <= currentLimit) {
                result.push(currentText);
                break;
            }
            
            let index = currentText.lastIndexOf("\n", currentLimit);
            
            if (index === -1) {
                index = currentLimit;
                result.push(currentText.slice(0, index));
                currentText = currentText.slice(index);
            } else {
                result.push(currentText.slice(0, index));
                currentText = currentText.slice(index + 1);
            }
            
            isFirstMessage = false;
        }
        
        return result;
    }
}


module.exports = new TelegramService();
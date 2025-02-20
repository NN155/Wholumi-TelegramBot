const axios = require('axios');
const FormData = require('form-data');

class TelegramPoster {
    constructor({chatId, threadId}) {
        this.TELEGRAM_CHAT_ID = chatId;
        this.TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
        this.TELEGRAM_THREAD_ID = threadId;
    }

    async sendPhoto(photoUrl, caption = "") {
        try {
            const form = new FormData();
            form.append('chat_id', this.TELEGRAM_CHAT_ID);
            form.append('message_thread_id', this.TELEGRAM_THREAD_ID);
            form.append('photo', photoUrl);
            form.append('caption', this._escapeMarkdownV2(caption));
            form.append('parse_mode', 'MarkdownV2');
            
            const response = await axios.post(`${this.TELEGRAM_API_URL}/sendPhoto`, form, {
                headers: {
                    ...form.getHeaders(),
                }
            });

            return response.data.result.message_id;
        } catch (error) {
            console.error('Error sending photo:', error);
            throw new Error('Failed to send photo message');
        }
    }

    async editMessageMedia(photoUrl, caption, messageId) {
        try {
            const media = {
                type: 'photo',
                media: photoUrl,
                caption: this._escapeMarkdownV2(caption),
                parse_mode: 'MarkdownV2'
            };

            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_thread_id: this.TELEGRAM_THREAD_ID,
                message_id: messageId,
                media: media
            };

            const response = await axios.post(`${this.TELEGRAM_API_URL}/editMessageMedia`, data);
            return response.data.result.message_id;
        } catch (error) {
            console.error('Error editing message media:', error);
            throw new Error('Failed to edit message media');
        }
    }

    async sendMessage(text) {
        try {
            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_thread_id: this.TELEGRAM_THREAD_ID,
                text: this._escapeMarkdownV2(text),
                parse_mode: 'MarkdownV2'
            };

            const response = await axios.post(`${this.TELEGRAM_API_URL}/sendMessage`, data);
            return response.data.result.message_id;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message');
        }
    }

    async editMessageText(messageId, text) {
        try {
            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_thread_id: this.TELEGRAM_THREAD_ID,
                message_id: messageId,
                text: this._escapeMarkdownV2(text),
                parse_mode: 'MarkdownV2'
            };
            
            const response = await axios.post(`${this.TELEGRAM_API_URL}/editMessageText`, data);
            return response.data.result.message_id;
        } catch (error) {
            console.error('Error editing message text:', error);
            throw new Error('Failed to edit message text');
        }
    }

    async deleteMessage(messageId) {
        try {
            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_id: messageId
            };

            await axios.post(`${this.TELEGRAM_API_URL}/deleteMessage`, data);
            return true;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw new Error('Failed to delete message');
        }
    }

    _escapeMarkdownV2(text) {
        return text.replace(/([_\[\]()~`>#+\-={}.!\\])/g, '\\$1');
    }
}

class TelegramBotWorker {
    constructor({chatId, threadId}, length = 999) {
        this.telegramBot = new TelegramPoster({chatId, threadId});
        this.cardMessageId = null;
        this.topMessagesIds = [];
        this.textSplitter = new TextSplitter(length);
    }

    async sendTopMessages(text, imgUrl) {
        const splittedText = this.textSplitter.split(text);

        for (let i = 0; i < splittedText.length; i++) {
            if (i === 0) {
                if (this.topMessagesIds[i]) {
                    await this.telegramBot.editMessageMedia(imgUrl, splittedText[i], this.topMessagesIds[i]);
                } else {
                    this.topMessagesIds[i] = await this.telegramBot.sendPhoto(imgUrl, splittedText[i]);
                }
            } else {
                if (this.topMessagesIds[i]) {
                    await this.telegramBot.editMessageText(splittedText[i], this.topMessagesIds[i]);
                } else {
                    const messageId = await this.telegramBot.sendMessage(splittedText[i]);
                    this.topMessagesIds[i] = messageId;
                }
            }
        }
    }
}

class TextSplitter {
    constructor(length = 999) {
        this.length = length;
    }

    split(text) {
        const result = [];
        let currentText = text;
        while (currentText.length > this.length) {
            let index = currentText.lastIndexOf("\n", this.length);
            if (index === -1) {
                index = this.length;
                result.push(currentText.slice(0, index));
                currentText = currentText.slice(index);
            } else {
                result.push(currentText.slice(0, index));
                currentText = currentText.slice(index + 1);
            }
        }
        result.push(currentText);
        return result;
    }
}

module.exports = {
    TelegramPoster,
    TelegramBotWorker,
    TextSplitter
};

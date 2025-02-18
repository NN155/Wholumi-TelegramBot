const axios = require('axios');
const FormData = require('form-data');

class TelegramMessagesService {
    constructor() {
        this.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        this.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        this.TELEGRAM_API_URL = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}`;
    }

    async sendPhoto(photoUrl, caption = "", messageThreadId = null) {
        try {
            const form = new FormData();
            form.append('chat_id', this.TELEGRAM_CHAT_ID);
            form.append('photo', photoUrl);
            form.append('caption', this._escapeMarkdownV2(caption));
            form.append('parse_mode', 'MarkdownV2');
            
            if (messageThreadId) {
                form.append('message_thread_id', messageThreadId);
            }

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

    async editMessageMedia(messageId, photoUrl, caption = "", messageThreadId = null) {
        try {
            const media = {
                type: 'photo',
                media: photoUrl,
                caption: this._escapeMarkdownV2(caption),
                parse_mode: 'MarkdownV2'
            };

            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_id: messageId,
                media: media
            };

            if (messageThreadId) {
                data.message_thread_id = messageThreadId;
            }

            const response = await axios.post(`${this.TELEGRAM_API_URL}/editMessageMedia`, data);
            return response.data.result.message_id;
        } catch (error) {
            console.error('Error editing message media:', error);
            throw new Error('Failed to edit message media');
        }
    }

    async sendMessage(text, messageThreadId = null) {
        try {
            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                text: this._escapeMarkdownV2(text),
                parse_mode: 'MarkdownV2'
            };

            if (messageThreadId) {
                data.message_thread_id = messageThreadId;
            }

            const response = await axios.post(`${this.TELEGRAM_API_URL}/sendMessage`, data);
            return response.data.result.message_id;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message');
        }
    }

    async editMessageText(messageId, text, messageThreadId = null) {
        try {
            const data = {
                chat_id: this.TELEGRAM_CHAT_ID,
                message_id: messageId,
                text: this._escapeMarkdownV2(text),
                parse_mode: 'MarkdownV2'
            };

            if (messageThreadId) {
                data.message_thread_id = messageThreadId;
            }

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

module.exports = new TelegramMessagesService();
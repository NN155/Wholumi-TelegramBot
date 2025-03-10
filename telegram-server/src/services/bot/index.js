class BotService {
    constructor() {
        this.bot = null;
    }
    async searchCards(action, { chatId, threadId, messageId, from }) {
        if (!await this._chatAccess(chatId, threadId)) return;
        const { access, message } = await this._getUserAccess(from.id, "searchCards");
        if (!access) {
            await this._sendBackMessage({ chatId, threadId, messageId }, message);
            return;
        }
        await this._sendAction("searchCards", action, { chatId, threadId, messageId, from });
    }

    async ban({ banType, timeValue, timeUnit, username, userId }, { chatId, threadId, messageId, from }) {
        if (!await this._chatAccess(chatId, threadId)) return;
        const permission = banType === 'permanent' ? 'permanentBan' : 'temporaryBan';
        let { access, message } = await this._getUserAccess(from.id, permission);
        if (!access) {
            await this._sendBackMessage({ chatId, threadId, messageId }, message);
            return;
        }

        let banDuration = null;
        if (banType === 'temporary') {
            const timeUnits = {
                m: 1,
                h: 60,
                d: 60 * 24,
                M: 60 * 24 * 30,
            }
            banDuration = timeValue * timeUnits[timeUnit];
        }
        const result = await this._ban({ telegramId: userId, telegramUsername: username, banDuration, banType });
        await this._sendBackMessage({ chatId, threadId, messageId }, result.message);
    }

    async _ban({ telegramId, telegramUsername, banDuration, banType }) {
        const response = await fetch(`${process.env.DB_SERVER_URL}/action/ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegramId,
                telegramUsername,
                banDuration,
                banType
            })
        });
        return await response.json();
    }

    async unban({ userId }, { chatId, threadId, messageId, from }) {
        if (!await this._chatAccess(chatId, threadId)) return;
        const { access, message } = await this._getUserAccess(from.id, "temperoryUnban");
        if (!access) {
            await this._sendBackMessage({ chatId, threadId, messageId }, message);
            return;
        }
        const response = await this._getUserAccess(from.id, "permanentUnban");

        const result = await this._unban({ telegramId: userId, permanent: response.access });
        await this._sendBackMessage({ chatId, threadId, messageId }, result.message);
    }

    async _unban({ telegramId, permanent }) {
        const response = await fetch(`${process.env.DB_SERVER_URL}/action/unban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegramId,
                permanent,
            })
        });
        return await response.json();
    }

    async status({ userId }, { chatId, threadId, messageId, from }) {
        if (!await this._chatAccess(chatId, threadId)) return;
        const { access, message } = await this._getUserAccess(from.id, "status");

        if (!access) {
            await this._sendBackMessage({ chatId, threadId, messageId }, message);
            return;
        }

        const result = await this._status({ telegramId: userId });

        await this._sendBackMessage({ chatId, threadId, messageId }, result.message);
    }

    async _status({ telegramId }) {
        const url = `${process.env.DB_SERVER_URL}/action/status`;
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegramId,
            })
        });
        return await response.json();
    }

    async _chatAccess(chatId, threadId = null) {
        let url = `${process.env.DB_SERVER_URL}/chat?chatId=${chatId}&threadId=${threadId}&mode=${process.env.MODE}&permissions[]=commands`;
        const response = await fetch(url);
        const data = await response.json();
        return !!data;
    }

    async _sendAction(mode, action, messageData) {
        console.log("Telegram-server: send action", action);
        const response = await fetch(`${process.env.MAIN_SERVER_URL}/telegram/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageData,
                action,
            })
        });
        return response;
    }
    async _getUserAccess(telegramId, action) {
        let url = `${process.env.DB_SERVER_URL}/action/userAccess`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegramId,
                action
            })
        });
        const json = await response.json();
        return json;
    }

    async _getUserIdByUsername(username, chatId) {
        
        try {
            const member = await this.bot.getChatMember(chatId, username.replace(/^@/, ''));
            return member?.user?.id ?? null;
        } catch (error) {
            console.error("Помилка отримання user ID:", error);
            return null;
        }
    }

    async _sendBackMessage({ chatId, threadId = null, messageId }, text) {
        await this.bot.sendMessage(chatId, text, {
            reply_to_message_id: messageId,
            message_thread_id: threadId,
        });
    }
}
module.exports = new BotService();
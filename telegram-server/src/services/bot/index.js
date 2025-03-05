class BotService {
    async searchCards(action, msgData) {
        if (await this._chatAccess(msgData.chatId, msgData.threadId)) {
            await this.sendAction(action, msgData);
        }
    }

    async _chatAccess(chatId, threadId = null) {
        let url = `${process.env.DB_SERVER_URL}/chat?chatId=${chatId}&threadId=${threadId}&mode=${process.env.MODE}&permissions[]=commands`;
        const response = await fetch(url);
        const data = await response.json();
        return !!data;
    }

    async sendAction(action, messageData) {
        console.log("Telegram-server: send action", action);
        const response = await fetch(`${process.env.MAIN_SERVER_URL}/telegram/searchCards`, {
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
}
module.exports = new BotService();
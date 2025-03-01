class BotService {
    async searchCards(msgData, command) {
        if (await this._chatAccess(msgData.chatId, msgData.threadId)) {
            await this.sendCommand(command, msgData);
        }
    }

    async _chatAccess(chatId, threadId) {
        const data = await this._getChat(chatId, threadId);
        return data?.mode === process.env.MODE
    }

    async _getChat(chatId, threadId = null) {
        let url = `${process.env.DB_SERVER_URL}/chat?chatId=${chatId}&threadId=${threadId}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async sendCommand(command, messageData) {
        const response = await fetch(`${process.env.MAIN_SERVER_URL}/telegram/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageData,
                command,
            })
        });
        return response;
    }
}
module.exports = new BotService();
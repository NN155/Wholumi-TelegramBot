class ActionService {
    constructor () {
        this.isWorking = null;
    }
    async searchCards({chatId, threadId, messageId, action}) {
        const data = await this.getOption("SearchCards");
        const option = data.optionValue[process.env.MODE];
        if (!option.active) {
            await this._sendBack({chatId, threadId, messageId, text: 'Module is offed'});
            return;
        }
        if (this.isWorking) {
            await this._sendBack({chatId, threadId, messageId, text: 'I`m working now, please wait a bit'});
            return;
        }
        this.isWorking = {chatId, threadId, messageId, action: action.action};
        await this.sendAction('searchCards', action);
    }

    async _sendModuleOffed({chatId, threadId, messageId}) {
        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({chatId, threadId, text: 'Module is offed', replyToMessageId: messageId}),
        });
    }
    async getOption(optionName) {
        const response = await fetch(`${process.env.DB_SERVER_URL}/option?optionName=${optionName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }


    async sendAction( action, data ) {
        console.log("Main server: send action", action, data);
        await fetch(`${process.env.EXTENSION_SERVER_URL}/action/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                data: data,
            }),
        });
    }

    async results(data) {
        const {threadId, chatId, messageId, action} = this.isWorking;
        this.isWorking = null;
        if (data.error) {
            await this._sendBack({threadId, chatId, messageId, text: data.error});
            return;
        }

        const {url} = await this._processData(data, action);
        console.log("Results url", url);
        await this._sendBack({threadId, chatId, messageId, text: url});
    }

    async _sendBack({chatId, threadId, messageId, text}) {
        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({chatId, threadId, text: text, replyToMessageId: messageId}),
        });
    }

    async _processData(data, action) {
        const response = await fetch(`${process.env.HOST_SERVER_URL}/engine/generators/genRouter.php`, {
            method: 'POST',
            body: JSON.stringify({
                action,
                data: data.cards,
                info: data.info,
                superSecretKey: process.env.SECRET_KEY
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }
}

module.exports = new ActionService();
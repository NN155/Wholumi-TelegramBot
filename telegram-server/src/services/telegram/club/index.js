const { TelegramBotWorker, TelegramPoster } = require('../../../tools/telegramMessage');

class Club {
    constructor() {
        this.dailyImage = process.env.POST_IMAGE;
        this.dailyWorker = null;
        this.dailyTime = null;
    }

   async  dailyBoost({message, chatId, threadId, image}) {
        this._dailyInit({chatId, threadId});
        await this.dailyWorker.sendTopMessages(message, image);

    }

    _dailyInit({chatId, threadId}) {
        if (this.dailyWorker === null) {
            this.dailyWorker = new TelegramBotWorker({chatId, threadId});
            this.dailyTime = Date.now();
        }
        else if (this.dailyTime + 1000 * 60 * 60 < Date.now()) {
            this.dailyWorker = new TelegramBotWorker({chatId, threadId});
            this.dailyTime = Date.now();
        }
    }

    async dailySkipped({pageUrl, chatId, threadId}) {
        const telegramPoster = new TelegramPoster({chatId, threadId});
        await telegramPoster.sendMessage(pageUrl);
    }
}

module.exports = new Club();
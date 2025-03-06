const { generateResultString } = require('../../../utils/boostInfo');

class Club {
    async dailyBoost({data, count, users}) {
        const message = generateResultString({data, count, users});

        const response = await fetch(`${process.env.DB_SERVER_URL}/chat?mode=${process.env.MODE}&permissions[]=club`);
        const chat = await response.json();
        const photoUrl = await this._randomImage();
        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendCoupleMessages`, {
            method: 'POST',
            body: JSON.stringify({
                photoUrl: photoUrl,
                caption: message,
                chatId: chat.chatId,
                threadId: chat.threadId,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return message;
    }

    async _randomImage() {
        const response = await fetch(`${process.env.DB_SERVER_URL}/images`);
        const images = await response.json();
        const { photoUrl } = images[Math.floor(Math.random() * images.length)];
        return photoUrl
    }

    async dailySkipped(data) {
        let response;
        response = await fetch(`${process.env.HOST_SERVER_URL}/generate.php`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { pageUrl } = await response.json();

        response = await fetch(`${process.env.DB_SERVER_URL}/chat?mode=${process.env.MODE}&permissions[]=moderator`);
        const chat = await response.json();

        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendMessage`, {
            method: 'POST',
            body: JSON.stringify({
                text: pageUrl,
                chatId: chat.chatId,
                threadId: chat.threadId,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return pageUrl
    }

}

module.exports = new Club();
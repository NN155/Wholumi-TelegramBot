const { generateResultString } = require('../../../utils/boostInfo');

class Club {
    async dailyBoost({ data, count, users }) {
        const message = generateResultString({ data, count, users });
        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendCoupleMessages`, {
            method: 'POST',
            body: JSON.stringify({
                photoUrl: process.env.DAILY_BOOST_IMAGE,
                caption: message,
                chatId: process.env.BOOST_CHAT_ID,
                threadId: process.env.BOOST_THREAD_ID
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return message;
    }

    async dailySkipped(data) {
        const response = await fetch(`${process.env.HOST_SERVER_URL}/engine/generators/genRouter.php`, {
            method: 'POST',
            body: JSON.stringify({
                action: "skip",
                data,
                superSecretKey: process.env.SECRET_KEY
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { pageUrl } = await response.json();

        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendMessage`, {
            method: 'POST',
            body: JSON.stringify({
                text: pageUrl,
                chatId: process.env.SKIPPED_CHAT_ID,
                threadId: process.env.SKIPPED_THREAD_ID
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return pageUrl
    }

}

module.exports = new Club();
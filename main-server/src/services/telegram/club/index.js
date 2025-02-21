class Club {
    async dailyBoost(message) {
        try {
            const response = await fetch(`${process.env.TELEGRAM_SERVER_URL}/extension/club/daily/boost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    chatId: process.env.DAILY_BOOST_CHAT_ID,
                    threadId: process.env.DAILY_BOOST_THREAD_ID,
                    image: process.env.DAILY_BOOST_IMAGE,
                })
            })
            return response.json();
        } catch (error) {
            return {error: error.message};
        }
        
    }
}

module.exports = new Club();
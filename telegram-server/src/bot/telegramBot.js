const TelegramBot = require('node-telegram-bot-api');
const botService = require('../services/bot');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
});


bot.onText(/\/(trade|need|users) (\d+) (.+)/, async (msg, match) => {
    try {
        const action = {
            action: match[1],
            id: match[2],
            name: match[3],
        }
        const msgData = {
            chatId: msg.chat.id,
            threadId: msg.message_thread_id || null,
            messageId: msg.message_id,
            from: msg.from,
        }
        await botService.searchCards(action, msgData);
    } catch (error) {
        console.error('Error on /trade|need|users:', error);
    }

});

bot.on('polling_error', (error) => {
    console.error('Error polling:', error);
});

console.log('🤖 Bot started');

module.exports = bot;
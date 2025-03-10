const TelegramBot = require('node-telegram-bot-api');
const botService = require('../services/bot');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
});

botService.bot = bot;

bot.onText(/^\/(trade|need|users) (\d+) (\S+)$/, async (msg, match) => {
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

bot.onText(/^\/ban (\d+)([mhdM])$/, async (msg, match) => {
    try {
        if (!msg.reply_to_message) return;
        
        const targetUser = msg.reply_to_message.from;
        
        if (targetUser.is_bot) return;
        
        const action = {
            userId: targetUser.id,
            username: targetUser.username ? '@' + targetUser.username : null,
            timeValue: match[1],
            timeUnit: match[2],
            banType: 'temporary',
        }
        
        const msgData = {
            chatId: msg.chat.id,
            threadId: msg.message_thread_id || null,
            messageId: msg.message_id,
            from: msg.from,
        }
        
        await botService.ban(action, msgData);
    } catch (error) {
        console.log('Error on /ban with time:', error);
    }
});

bot.onText(/^\/ban$/, async (msg) => {
    try {
        if (!msg.reply_to_message) return;
        if (msg.reply_to_message.message_id === msg.message_thread_id) return;

        const targetUser = msg.reply_to_message.from;
        
        if (targetUser.is_bot) return;
        
        const action = {
            userId: targetUser.id,
            banType: 'permanent',
        }
        
        const msgData = {
            chatId: msg.chat.id,
            threadId: msg.message_thread_id || null,
            messageId: msg.message_id,
            from: msg.from,
        }

        await botService.ban(action, msgData);
    } catch (error) {
        console.log('Error on /ban permanent:', error);
    }
});

bot.onText(/^\/unban$/, async (msg) => {
    try {
        if (!msg.reply_to_message) return;
        if (msg.reply_to_message.message_id === msg.message_thread_id) return;

        const targetUser = msg.reply_to_message.from;

        if (targetUser.is_bot) return;
        
        const action = {
            userId: targetUser.id,
        }
        
        const msgData = {
            chatId: msg.chat.id,
            threadId: msg.message_thread_id || null,
            messageId: msg.message_id,
            from: msg.from,
            targetMessageId: msg.reply_to_message.message_id
        }
        
        await botService.unban(action, msgData);
    } catch (error) {
        console.log('Error on /unban:', error);
    }
});

bot.onText(/^\/status$/, async (msg, match) => {
    try {
        if (!msg.reply_to_message) return;
        if (msg.reply_to_message.message_id === msg.message_thread_id) return;
        
        const targetUser = msg.reply_to_message.from;

        if (targetUser.is_bot) return;
        
        const action = {
            userId: targetUser.id,
        }

        const msgData = {
            chatId: msg.chat.id,
            threadId: msg.message_thread_id || null,
            messageId: msg.message_id,
            from: msg.from,
        }
        await botService.status(action, msgData);
    } catch (error) {
        console.log('Error on /unban:', error);
    }
});

bot.on('polling_error', (error) => {
    console.error('Error polling:', error);
});

console.log('🤖 Bot started');

module.exports = bot;
const personal = require('./personal');
const club = require('./club');

class TelegramService {
    personal = personal;
    club = club;
}

module.exports = new TelegramService();

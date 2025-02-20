const Personal = require('./personal');
const Club = require('./club');

class TelegramService {
    Personal = Personal;
    Club = Club;
}

module.exports = new TelegramService();

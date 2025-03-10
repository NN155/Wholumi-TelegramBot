const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    customName: {
        type: String,
    },
    telegramId: {
        type: Number,
    },
    telegramUsername: {
        type: String,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    banType: {
        type: String,
    },
    banExpireDate: {
        type: Date,
    },
    role: {
        type: String,
        default: 'visitor',
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
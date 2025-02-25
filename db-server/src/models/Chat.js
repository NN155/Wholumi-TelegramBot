const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    threadId: {
        type: Number,
    },
    mode: {
        type: String,
    },
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
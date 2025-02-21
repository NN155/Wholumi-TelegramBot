const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
    },
    suffix: {
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const OptionsSchema = new mongoose.Schema({
    optionName: {
        type: String,
        required: true,
        unique: true,
    },
    optionValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const Options = mongoose.model('Options', OptionsSchema);

module.exports = Options;
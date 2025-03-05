const mongoose = require('mongoose');

const ImagesSchema = new mongoose.Schema({
    photoUrl: {
        type: String,
        required: true,
    },
});

const Images = mongoose.model('Images', ImagesSchema);

module.exports = Images;
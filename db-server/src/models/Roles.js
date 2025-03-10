const mongoose = require('mongoose');

const RolesSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const Roles = mongoose.model('Roles', RolesSchema);

module.exports = Roles;
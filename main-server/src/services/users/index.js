const mongoose = require('mongoose');
const User = require('../../models/users');

class UsersService{
    async getAll() {
        return await User.find();
    }
}

module.exports = new UsersService();
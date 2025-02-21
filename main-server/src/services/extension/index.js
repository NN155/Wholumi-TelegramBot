const Club = require('./club');

class ExtensionService {
    constructor() {
        this.Club = Club;
    }
}

module.exports = new ExtensionService();
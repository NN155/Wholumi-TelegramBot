const User = require('../../models/User');
const Chat = require('../../models/Chat');

class BaseCacheService {
    constructor(model) {
        this.model = model;
        this.cache = new Map();
        this._init();
    }

    async _init() {
        await this._loadAllToCache();
        this._startWatchingCache();
    }

    // Load all documents into cache
    async _loadAllToCache() {
        console.log(`Loading all ${this.model.modelName} documents into cache...`);
        const documents = await this.model.find({});
        this.cache.clear();
        documents.forEach(doc => {
            this.cache.set(doc._id.toString(), doc);
        });
        console.log(`Cache updated: ${this.cache.size} ${this.model.modelName} documents`);
    }

    // Watch for changes in the collection
    _startWatchingCache() {
        const changeStream = this.model.watch();
        changeStream.on('change', async (change) => {
            console.log(`${this.model.modelName} collection change detected:`, change);
            const { operationType, documentKey, fullDocument } = change;
            const docId = documentKey?._id.toString();

            if (operationType === 'insert' || operationType === 'update' || operationType === 'replace') {
                this.cache.set(docId, fullDocument);
            } else if (operationType === 'delete') {
                this.cache.delete(docId);
            }
        });
    }

    // Public method to get all documents from cache
    getAll() {
        return Array.from(this.cache.values());
    }

    findOne(query) {
        if (Object.keys(query).length === 0) {
            return null;
        }
        const result = Array.from(this.cache.values()).find(doc => {
            return Object.keys(query).every(key => {
                return doc[key] == query[key];
            });
        });
    
        return result || null;
    }
}    

class UserService extends BaseCacheService {
    constructor() {
        super(User);
    }
}

class ChatService extends BaseCacheService {
    constructor() {
        super(Chat);
    }
}

class DBService {
    users = new UserService();
    chats = new ChatService();
}

module.exports = new DBService();
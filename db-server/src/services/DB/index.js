const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Options = require('../../models/Options');
const Images = require('../../models/Images');
const Roles = require('../../models/Roles');

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
            const { operationType, documentKey } = change;
            
            const docId = documentKey?._id.toString();
            
            if (operationType === 'insert' || operationType === 'update' || operationType === 'replace') {
                const fullDocument = await this.model.findById(docId);
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
                const docValue = doc.get(key);
                const queryValue = query[key];
                if (Array.isArray(docValue)) {
                    if (Array.isArray(queryValue)) {
                        return queryValue.every(item => docValue.includes(item));
                    }
                    return docValue.includes(queryValue);
                }
                
                if (Array.isArray(queryValue)) {
                    return queryValue.includes(docValue);
                }
                
                return docValue == queryValue;
            });
        });
    
        return result || null;
    }
}    

class UsersService extends BaseCacheService {
    constructor() {
        super(User);
    }
}

class ChatsService extends BaseCacheService {
    constructor() {
        super(Chat);
    }
}

class OptionsService extends BaseCacheService {
    constructor() {
        super(Options);
    }
}

class ImagesService extends BaseCacheService {
    constructor() {
        super(Images);
    }
}

class RolesService extends BaseCacheService {
    constructor() {
        super(Roles);
    }
}

class DBService {
    users = new UsersService();
    chats = new ChatsService();
    options = new OptionsService();
    images = new ImagesService();
    roles = new RolesService();
}

module.exports = new DBService();
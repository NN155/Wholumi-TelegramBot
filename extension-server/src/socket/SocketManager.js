
class SocketManager  {
    constructor() {
        this.io = null;
        this.socketsConnection = new Set();
        this.socketInstances = new Map();
    }
    
    getSocket() {
        const socketId = this.socketsConnection.values().next().value;
        return this.socketInstances.get(socketId);
    }

    setIo(io) {
        this.io = io;
    }

    handleConnection(socket) {
        this._addSocket(socket);
        this.handleDisconnect(socket);
        
        this._setupSocketListeners(socket);
    }

    _setupSocketListeners(socket) {
        socket.on('searchResults', (data) => {
            try {
                console.log(`Received searchResults from ${socket.id}:`, data);
                fetch(`${process.env.MAIN_SERVER_URL}/action/results`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data.result),
                })
            } catch (error) {
                console.error(error);
            }
        });
        
    }

    handleDisconnect(socket) {
        socket.on('disconnect', () => {
            this._removeSocket(socket);
        });
    }

    _addSocket = (socket) => {
        this.socketsConnection.add(socket.id);
        this.socketInstances.set(socket.id, socket);

        console.log(`Socket ${socket.id} connected.`);
    };

    _removeSocket = (socket) => {
        this.socketsConnection.delete(socket.id);
        this.socketInstances.delete(socket.id);

        console.log(`Socket ${socket.id} disconnected.`);
    };

    sendToSocket(socketId, event, data) {
        if (typeof socketId === 'object' && socketId.id) {
            socketId = socketId.id;
        }

        const socket = this.socketInstances.get(socketId);
        if (socket) {
            console.log(`Sending ${event} to socket ${socketId}`);
            socket.emit(event, data);
            return true;
        } else {
            console.log(`Socket ${socketId} not found`);
            return false;
        }
    }
}

module.exports = new SocketManager();

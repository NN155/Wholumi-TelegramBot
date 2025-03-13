class SocketManager  {
    constructor() {
        this.io = null;
        this.socketsConnection = new Set();
        this.socketInstances = new Map();
        this.workingSocket = null;
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
            console.log('Results', data.result);
            const { ActionService } = require('../services'); 
            ActionService.sendResponse(data.result);
        });
        
    }

    handleDisconnect(socket) {
        socket.on('disconnect', () => {
            this._removeSocket(socket);
            if (this.workingSocket?.socketId === socket.id) {
                console.log(`Socket ${socket.id} disconnected while working anout task ${this.workingSocket.taskId}`);
                const { ActionService } = require('../services'); 
                ActionService.sendResponse({error: "Something went wrong. Socket disconnected.", taskId: this.workingSocket.taskId});
            }
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

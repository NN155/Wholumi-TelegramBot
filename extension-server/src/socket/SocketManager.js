class SocketManager  {
    constructor() {
        this.io = null;
        this.socketsConnection = new Set();

    }
    getSocketsId(userId) {
        return this.onlineUsers.byUserId[userId];
    }

    setIo(io) {
        this.io = io;
    }

    handleConnection(socket) {
        this._addSocket(socket);
        this.handleDisconnect(socket);
    }

    handleDisconnect(socket) {
        socket.on('disconnect', () => {
            this._removeSocket(socket);
        });
    }

    _addSocket = (socket) => {
        this.socketsConnection.add(socket.id);

        console.log(`Socket ${socket.id} connected.`);
    };

    _removeSocket = (socket) => {
        this.socketsConnection.delete(socket.id);

        console.log(`Socket ${socket.id} disconnected.`);
    };
}

module.exports = new SocketManager();

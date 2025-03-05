const SocketManager = require('./SocketManager');

class SocketDispatcher {
    sendEvent(event, data) {
        console.log(event, data);
        const socketId = SocketManager.getSocket();
        SocketManager.sendToSocket(socketId, event, data);
    }
}

module.exports = new SocketDispatcher()
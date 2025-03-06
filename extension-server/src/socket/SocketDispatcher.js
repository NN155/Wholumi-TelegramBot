const SocketManager = require('./SocketManager');

class SocketDispatcher {
    sendEvent(event, data) {
        console.log(event, data);
        const socketId = SocketManager.getSocket();
        if (!socketId) {
            const { ActionService } = require('../services');
            ActionService.sendResponse({error: 'Try again later'});
        }
        SocketManager.sendToSocket(socketId, event, data);
    }
}

module.exports = new SocketDispatcher()
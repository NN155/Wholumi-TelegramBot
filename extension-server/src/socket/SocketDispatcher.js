const SocketManager = require('./SocketManager');

class SocketDispatcher {
    sendEvent(event, data) {
        console.log(event, data);
        const socketId = SocketManager.getSocket();
        if (!socketId) {
            const { ActionService } = require('../services');
            ActionService.sendResponse({error: 'Try again later', taskId: data.taskId});
        }
        SocketManager.workingSocket = {socketId: socketId.id, taskId: data.taskId};
        SocketManager.sendToSocket(socketId, event, data);
    }

    clearSocket() {
        SocketManager.workingSocket = null;
    }
}

module.exports = new SocketDispatcher()
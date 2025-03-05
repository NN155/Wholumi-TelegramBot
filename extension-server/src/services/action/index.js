const socketDispatcher = require('../../socket/SocketDispatcher');

class ActionService {
    proccessAction({action, data}) {
        socketDispatcher.sendEvent(action, data);
    }
}

module.exports = new ActionService();
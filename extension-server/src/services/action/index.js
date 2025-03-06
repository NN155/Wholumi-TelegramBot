const socketDispatcher = require('../../socket/SocketDispatcher');

class ActionService {
    proccessAction({action, data}) {
        socketDispatcher.sendEvent(action, data);
    }

    sendResponse(data) {
        try {
            fetch(`${process.env.MAIN_SERVER_URL}/action/results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new ActionService();
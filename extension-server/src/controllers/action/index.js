const { ActionService } = require('../../services');

class ActionController {
    async proccessAction(req, res) {
        try {
            ActionService.proccessAction(req.body)
            res.sendStatus(204)
        } catch (error) {
            console.error(error)
            res.status(500).send
        }
    }
    async sendResponse(req, res) {
        try {
            ActionService.sendResponse(req.body.result)
            res.sendStatus(204)
        } catch (error) {
            console.error(error)
            res.status(500).send
        }
    }
}

module.exports = new ActionController();
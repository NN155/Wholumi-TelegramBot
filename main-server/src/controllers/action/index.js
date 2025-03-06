const { ActionService } = require('../../services');

class ActionController {
    async results(req, res) {
        try {
            const results = await ActionService.results(req.body);
            return res.status(200).json(results);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ActionController();
const { ClubServices } = require('../../services');

class ClubController {
    async dailyBoost(req, res) {
        const response = await ClubServices.dailyBoost(req.body);
        res.status(200).send(response);
    }
}

module.exports = new ClubController();
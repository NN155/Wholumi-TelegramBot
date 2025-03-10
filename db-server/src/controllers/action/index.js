const { ActionService, DBService } = require('../../services');
class ActionController {
    async userAccess(req, res) {
        try {
            const user = await DBService.users.findOne({telegramId: req.body.telegramId});
            let roleRank = 'visitor';
            if (user) {
                roleRank = user.get('role') || roleRank;
            }
            const role = await DBService.roles.findOne({
                role: roleRank
            });
            const response = await ActionService.userAccess({...req.body, user, role});
            res.json(response);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async ban(req, res) {
        try {
            const response = await ActionService.ban(req.body);
            res.json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async unban(req, res) {
        try {
            const response = await ActionService.unban(req.body);
            res.json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async status(req, res) {
        try {
            const response = await ActionService.status(req.body);
            res.json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ActionController();
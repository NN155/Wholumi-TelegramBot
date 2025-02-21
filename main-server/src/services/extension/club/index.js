const { generateResultString } = require('../../../tools/boostInfo');

class Club {
    dailyBoost({data, count, users}) {
        return generateResultString({data, count, users});
    }

}

module.exports = new Club();
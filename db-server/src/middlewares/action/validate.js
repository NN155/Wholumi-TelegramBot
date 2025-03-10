const Joi = require('joi');
const validationMiddleware = require('../../utils/validation');

const userAccessSchema = Joi.object({
    telegramId: Joi.number().required(),
    action: Joi.string().required(),
});

const banSchema = Joi.object({
    telegramId: Joi.number().required(), 
    telegramUsername: Joi.string().allow(null).default(null), 
    banType: Joi.string().valid('permanent', 'temporary').required(), 
    banDuration: Joi.number().min(1).when('banType', {
        is: 'temporary',
        then: Joi.number().required(),
        otherwise: Joi.number().allow(null).default(null)
    })
});

const unbanSchema = Joi.object({
    telegramId: Joi.number().required(),
    permanent: Joi.boolean().default(false),
});

const statusSchema = Joi.object({
    telegramId: Joi.number().required(), 
});

const userAccess = validationMiddleware.body(userAccessSchema);
const ban = validationMiddleware.body(banSchema);
const unban = validationMiddleware.body(unbanSchema);
const status = validationMiddleware.body(statusSchema);

module.exports = {
    userAccess,
    ban,
    unban,
    status,
};
const Joi = require('joi');
const validationMiddleware = require('../../utils/validation');

const sendPhotoSchema = Joi.object({
    chatId: Joi.number().required(),
    threadId: Joi.number().allow(null),
    photoUrl: Joi.string().required(),
    caption: Joi.string().allow(''),
    replyToMessageId: Joi.number().allow(null)
});

const editMessageMediaSchema = Joi.object({
    photoUrl: Joi.string().required(),
    caption: Joi.string().allow(''),
    messageId: Joi.number().required(),
    chatId: Joi.number().required(),
});

const sendMessageSchema = Joi.object({
    chatId: Joi.number().required(),
    text: Joi.string().required(),
    threadId: Joi.number().allow(null),
    replyToMessageId: Joi.number().allow(null)
});

const editMessageTextSchema = Joi.object({
    chatId: Joi.number().required(),
    text: Joi.string().required(),
    messageId: Joi.number().required(),
});

const deleteMessageSchema = Joi.object({
    chatId: Joi.number().required(),
    messageId: Joi.number().required()
});


const sendCoupleMessagesSchema = Joi.object({
    chatId: Joi.number().required(),
    threadId: Joi.number().allow(null),
    photoUrl: Joi.string().required(),
    caption: Joi.string().allow(''),
    replyToMessageId: Joi.number().allow(null)
});

const sendPhoto = validationMiddleware.body(sendPhotoSchema);
const editMessageMedia = validationMiddleware.body(editMessageMediaSchema);
const sendMessage = validationMiddleware.body(sendMessageSchema);
const editMessageText = validationMiddleware.body(editMessageTextSchema);
const deleteMessage = validationMiddleware.body(deleteMessageSchema);
const sendCoupleMessages = validationMiddleware.body(sendCoupleMessagesSchema);

module.exports = {
    sendPhoto,
    editMessageMedia,
    sendMessage,
    editMessageText,
    deleteMessage,
    sendCoupleMessages
};
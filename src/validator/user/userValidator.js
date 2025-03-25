
const Joi = require('joi');

const UserValidator = {
    userRegisterValidationSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
            loginType: Joi.string().required(),
            username: Joi.string().required(),
            address1: Joi.string().required(),
            address2: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required()
        }),
    },

    userLoginValidationSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    },
}

module.exports = UserValidator;
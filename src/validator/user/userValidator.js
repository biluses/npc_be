
const Joi = require('joi');

const UserValidator = {
    userRegisterValidationSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string(),
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

    userForgotValidationSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },

    userOtpValidationSchema: {
        body: Joi.object({
            forgotCode: Joi.string().required(),
            secretId: Joi.string().required()
        }),
    },

    userResetPasswordValidationSchema: {
        body: Joi.object({
            newPassword: Joi.string().required(),
            secretId: Joi.string().required()
        }),
    },
}

module.exports = UserValidator;

const Joi = require('joi');

const AdminValidator = {
    adminLoginValidationSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            loginType: Joi.string().valid('admin', 'college', 'organisation').default('admin'),
        }),
    },

    adminForgotPasswordValidator: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },

    adminVerifyResetPasswordValidator: {
        body: Joi.object({
            otp: Joi.number().required(),
        }),
    },

    adminResetPasswordValidator: {
        body: Joi.object({
            password: Joi.string().required()
        }),
    },
}

module.exports = AdminValidator;

const Joi = require('joi');

const PolicyValidator = {
    createPolicyValidationSchema: {
        body: Joi.object({
            type: Joi.string().required(),
            description: Joi.string().required(),
        }),
    },

    updatePolicyValidationSchema: {
        body: Joi.object({
            description: Joi.string().required(),
        }),
    },
}

module.exports = PolicyValidator;
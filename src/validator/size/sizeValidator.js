
const Joi = require('joi');

const SizeValidator = {
    createSizeValidationSchema: {
        body: Joi.object({
            name: Joi.string().required(),
        }),
    },

    updateSizeValidationSchema: {
        body: Joi.object({
            name: Joi.string().required(),
        }),
    },
}

module.exports = SizeValidator;
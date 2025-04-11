
const Joi = require('joi');

const ColorValidator = {
    createColorValidationSchema: {
        body: Joi.object({
            name: Joi.string().required(),
            code: Joi.string().required(),
        }),
    },

    updateColorValidationSchema: {
        body: Joi.object({
            name: Joi.string().required(),
            code: Joi.string().required(),
        }),
    },
}

module.exports = ColorValidator;
const Joi = require('joi');

const ProductValidator = {
    createProductValidationSchema: {
        body: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(null, ''),
            price: Joi.number().required(),
            categoryId: Joi.number().required(),
            isPin: Joi.boolean().default(false),
            variants: Joi.array().items(
                Joi.object({
                    colorId: Joi.number().required(),
                    sizes: Joi.array().items(
                        Joi.object({
                            sizeId: Joi.number().required(),
                            quantity: Joi.number().required()
                        })
                    ).required(),
                    images: Joi.array().items(Joi.string()).required()
                })
            ).required()
        }),
    },

    updateProductValidationSchema: {
        body: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(null, ''),
            price: Joi.number().required(),
            categoryId: Joi.number().required(),
            isPin: Joi.boolean().default(false),
            variants: Joi.array().items(
                Joi.object({
                    colorId: Joi.number().required(),
                    sizes: Joi.array().items(
                        Joi.object({
                            sizeId: Joi.number().required(),
                            quantity: Joi.number().required()
                        })
                    ).required(),
                    images: Joi.array().items(Joi.string()).required()
                })
            ).required()
        }),
    },
};

module.exports = ProductValidator; 
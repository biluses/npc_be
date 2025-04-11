const ProductServices = require('../../services/product/productServices');

const productController = {
    create: async (req, res, next) => {
        try {
            const productCreateResponse = await ProductServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Product create successfully !", productCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    update: async (req, res, next) => {
        try {
            const productUpdateResponse = await ProductServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Product update successfully !", productUpdateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getOne: async (req, res, next) => {
        try {
            const productResponse = await ProductServices.getProductDetail(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Product get successfully !", productResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getAll: async (req, res, next) => {
        try {
            const allProductResponse = await ProductServices.getAllProduct(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "All product get successfully !", allProductResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

}

module.exports = productController;
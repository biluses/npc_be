const ProductServices = require('../../../services/product/productServices');

const productController = {
    getProductDetails: async (req, res, next) => {
        try {
            const productResponse = await ProductServices.getProductDetail(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Product get successfully !", productResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getAllProducts: async (req, res, next) => {
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
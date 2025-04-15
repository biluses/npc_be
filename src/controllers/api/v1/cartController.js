const CartServices = require('../../../services/cart/cartServices');

const cartController = {
    // POST create(protected API)
    create: async (req, res, next) => {
        try {
            const cartCreateResponse = await CartServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Item added to cart successfully !", cartCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // PATCH update(protected API)
    update: async (req, res, next) => {
        try {
            const cartUpdateResponse = await CartServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Cart update successfully !", cartUpdateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // DELETE delete(protected API)
    delete: async (req, res, next) => {
        try {
            const cartDeleteResponse = await CartServices.delete(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Cart item deleted successfully !", cartDeleteResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET get all cart item(protected API)
    cartList: async (req, res, next) => {
        try {
            const cartListResponse = await CartServices.cartList(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get all cart item successfully !", cartListResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
}

module.exports = cartController;
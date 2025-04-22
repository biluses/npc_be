const OrderServices = require('../../services/order/orderServices');

const orderController = {
    getAllOrders: async (req, res, next) => {
        try {
            const orderHistoryResponse = await OrderServices.getAllOrders(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get all order history successfully !", orderHistoryResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    updateOrderStatus: async (req, res, next) => {
        try {
            const orderStatusResponse = await OrderServices.updateOrderStatus(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Order status updated successfully !", orderStatusResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
}

module.exports = orderController;
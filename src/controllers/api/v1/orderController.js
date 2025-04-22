const OrderServices = require('../../../services/order/orderServices');

const orderController = {
    // POST create order(protected API)
    createOrder: async (req, res, next) => {
        try {
            const orderCreateResponse = await OrderServices.createOrder(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Order create successfully !", orderCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET get all order history by user(protected API)
    getAllUserOrders: async (req, res, next) => {
        try {
            const orderHistoryResponse = await OrderServices.getAllUserOrders(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get all order history successfully !", orderHistoryResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET get order details(protected API)
    orderDetails: async (req, res, next) => {
        try {
            const orderDetailsResponse = await OrderServices.orderDetails(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get order details successfully !", orderDetailsResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
}

module.exports = orderController;
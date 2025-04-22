import { Order, OrderItem, Cart, ProductVariant, Color, Size, Product } from "../../models";

import { generateOrderNo } from "../../helpers" 

const OrderServices = {
    async createOrder(req, res, next) {
        const userId = req.loggedInUser.id;
        let totalAmount = 0;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: ProductVariant, as: 'variant', include: [Product, Color, Size] }]
        });

        if (!cartItems.length) {
            return res.status(400).json({ status: false, message: 'Cart is empty' });
        }

        // Check stock availability
        for (let item of cartItems) {
            const variant = item.variant;

            if (item.quantity > variant.quantity) {
                throw new Error(`Insufficient stock for ${variant.Product.name}`);
            }
            totalAmount += variant.Product.price * item.quantity;
        }

        const orderNo = await generateOrderNo();

        const newOrder = await Order.create({ userId, totalAmount, orderNo, staus: 1 });

        for (let item of cartItems) {
            const variant = item.variant;

            await OrderItem.create({
                orderId: newOrder.id,
                userId,
                productId: variant.Product.id,
                productVariantId: variant.id,
                quantity: item.quantity,
                price: variant.Product.price,
            });

            // Reduce stock
            await ProductVariant.update(
                { quantity: variant.quantity - item.quantity },
                { where: { id: variant.id } }
            );
        }

        await Cart.destroy({ where: { userId } });

        return {
            data: { order: newOrder }
        };
    },

    async getAllUserOrders(req, res, next) {
        const userId = req.loggedInUser.id;
        const orders = await Order.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price']
                        },
                        {
                            model: ProductVariant,
                            include: [
                                { model: Color, attributes: ['id', 'name'] },
                                { model: Size, attributes: ['id', 'name'] }
                            ]
                        }
                    ]
                }
            ]
        });

        return {
            data: { orders }
        };
    },

    async orderDetails(req, res, next) {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            where: { id: orderId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price']
                        },
                        {
                            model: ProductVariant,
                            include: [
                                { model: Color, attributes: ['id', 'name'] },
                                { model: Size, attributes: ['id', 'name'] }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return {
            data: { order }
        };
    },

    async getAllOrders(req, res, next) {
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price']
                        },
                        {
                            model: ProductVariant,
                            include: [
                                { model: Color, attributes: ['id', 'name'] },
                                { model: Size, attributes: ['id', 'name'] }
                            ]
                        }
                    ]
                }
            ]
        });

        return {
            data: { orders }
        };
    },

    async updateOrderStatus(req, res, next) {
        const { orderId, status } = req.body;

        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            throw new Error('Order not found');
        }

        const currentStatus = order.status;

        // Allow only forward transitions
        if (status <= currentStatus || status > 4 || status < 1) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
        }

        order.status = status;
        await order.save();

        return {
            data: { order },
        };
    }

}

module.exports = OrderServices;
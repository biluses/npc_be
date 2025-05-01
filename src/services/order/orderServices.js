import { Order, OrderItem, Cart, ProductVariant, Color, Size, Product, User } from "../../models";
const { Op } = require("sequelize");
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

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

        const where = { userId };

        // Advanced search across relations
        if (search) {
            where[Op.or] = [
                { orderNo: { [Op.like]: `%${search}%` } },
                { '$items.Product.name$': { [Op.like]: `%${search}%` } },
                { '$items.User.username$': { [Op.like]: `%${search}%` } },
                { '$items.User.email$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            limit: limit + 1,
            offset,
            distinct: true,
            subQuery: false, // necessary for correct nested search
            order: [[sortBy, sortOrder]],
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username', 'email', 'profilePicture'],
                            required: false
                        },
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price'],
                            required: false
                        },
                        {
                            model: ProductVariant,
                            required: false,
                            include: [
                                { model: Color, attributes: ['id', 'name'], required: false },
                                { model: Size, attributes: ['id', 'name'], required: false }
                            ]
                        }
                    ]
                }
            ]
        });

        const isNextPage = orders.length > limit;
        if (isNextPage) orders.pop(); // remove the extra one

        return {
            data: {
                totalCount: count,
                currentPage: page,
                isNextPage,
                orders
            }
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
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

        const where = {};

        const include = [
            {
                model: User,
                attributes: ['id', 'username', 'email', 'profilePicture'],
                required: false // important: allows LEFT JOIN so search doesn't break
            },
            {
                model: OrderItem,
                as: 'items',
                required: false,
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price'],
                        required: false
                    },
                    {
                        model: ProductVariant,
                        required: false,
                        include: [
                            { model: Color, attributes: ['id', 'name'], required: false },
                            { model: Size, attributes: ['id', 'name'], required: false }
                        ]
                    }
                ]
            }
        ];

        if (search) {
            where[Op.or] = [
                { orderNo: { [Op.like]: `%${search}%` } },
                { '$User.username$': { [Op.like]: `%${search}%` } },
                { '$User.email$': { [Op.like]: `%${search}%` } },
                { '$items.Product.name$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include,
            subQuery: false, // crucial to avoid subquery wrapping the FROM clause
            limit: limit + 1,
            offset,
            distinct: true,
            order: [[sortBy, sortOrder]]
        });

        const isNextPage = orders.length > limit;
        if (isNextPage) orders.pop(); // remove extra one

        return {
            data: {
                totalCount: count,
                currentPage: page,
                isNextPage,
                orders
            }
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
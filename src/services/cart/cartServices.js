import { Cart, ProductVariant, Color, Size, Product } from "../../models";

const CartServices = {
    async create(req, res, next) {
        const { productVariantId, quantity } = req.body;

        const variant = await ProductVariant.findByPk(productVariantId);
        if (!variant) {
            throw new Error("Invalid product variant");
        }

        const newQty = created ? quantity : cartItem.quantity + quantity;
        if (newQty > variant.quantity) {
            throw new Error(`Only ${variant.quantity} item(s) available in stock`);
        }

        const [cartItem, created] = await Cart.findOrCreate({
            where: { userId: req.loggedInUser.id, productVariantId },
            defaults: { quantity }
        });

        if (!created) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }
        return {
            data: { cart: cartItem }
        };
    },

    async update(req, res, next) {
        const { cartId } = req.params;
        const { productVariantId, quantity } = req.body;

        if (!productVariantId || typeof quantity !== 'number' || quantity < 1) {
            throw new Error("productVariantId and valid quantity are required");
        }

        const cartItem = await Cart.findOne({
            where: { id: cartId, userId: req.loggedInUser.id }
        });

        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        const variant = await ProductVariant.findByPk(productVariantId);
        if (!variant) {
            throw new Error("Invalid product variant");
        }

        // Check available stock
        if (quantity > variant.quantity) {
            throw new Error(`Only ${variant.quantity} item(s) available in stock`);
        }

        cartItem.productVariantId = productVariantId;
        cartItem.quantity = quantity;
        await cartItem.save();

        return {
            message: "Cart item updated successfully",
            data: { cart: cartItem }
        };
    },

    async delete(req, res, next) {
        const { cartId } = req.params;

        const cartData = await Cart.findByPk(cartId)
        if (!cartData) {
            throw new Error("Invalid cartId")
        }

        await Cart.destroy({ where: { id: cartId } });

        return true
    },

    async cartList(req, res, next) {

        const cart = await Cart.findAll({
            where: { userId: req.loggedInUser.id },
            include: [{
                model: ProductVariant,
                as: 'variant',
                include: [
                    { model: Product },
                    { model: Color },
                    { model: Size }
                ]
            }]
        });

        return {
            data: { cart }
        }
    },
}

module.exports = CartServices;
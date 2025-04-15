import { Cart, ProductVariant, Color, Size, Product } from "../../models";

const PostServices = {
    async create(req, res, next) {
        const { productVariantId, quantity } = req.body;

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

        const cartItem = await Cart.findByPk(cartId);
        if (!cartItem) throw new Error("Cart not found");

        cartItem.productVariantId = productVariantId;
        cartItem.quantity = quantity;
        await cartItem.save();

        return {
            data: { cart: cartItem }
        };
    },

    async delete(req, res, next) {
        const { cartId } = req.params;

        const cartData = await Cart.findByPk(cartId)
        if(!cartData){
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

module.exports = PostServices;
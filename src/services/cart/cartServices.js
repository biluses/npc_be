import { Cart, ProductVariant, Color, Size, Product, ProductImage } from "../../models";

const CartServices = {
    async create(req, res, next) {
        const { productVariantId, quantity } = req.body;

        if (!productVariantId || typeof quantity !== 'number' || quantity < 1) {
            throw new Error("productVariantId and a valid quantity are required");
        }

        const variant = await ProductVariant.findByPk(productVariantId);
        if (!variant) {
            throw new Error("Invalid product variant");
        }

        const existingCartItem = await Cart.findOne({
            where: {
                userId: req.loggedInUser.id,
                productVariantId
            }
        });

        const newQty = existingCartItem ? existingCartItem.quantity + quantity : quantity;

        if (newQty > variant.quantity) {
            throw new Error(`Only ${variant.quantity} item(s) available in stock`);
        }

        let cartItem;
        if (existingCartItem) {
            existingCartItem.quantity = newQty;
            await existingCartItem.save();
            cartItem = existingCartItem;
        } else {
            cartItem = await Cart.create({
                userId: req.loggedInUser.id,
                productVariantId,
                quantity
            });
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

        const cartData = await Cart.findOne({
            where: { id: cartId, userId: req.loggedInUser.id }
        })
        if (!cartData) {
            throw new Error("Invalid cartId")
        }

        await Cart.destroy({ where: { id: cartId } });

        return true
    },

    async cartList(req, res, next) {
        const cartItems = await Cart.findAll({
            where: { userId: req.loggedInUser.id },
            include: [
                {
                    model: ProductVariant,
                    as: 'variant',
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price'],
                            include: [
                                {
                                    model: ProductImage,
                                    as: 'images',
                                    attributes: ['imageUrl'],
                                    separate: true, // optional: ensures only relevant images
                                    limit: 1
                                }
                            ]
                        },
                        {
                            model: Color,
                            attributes: ['id', 'name', 'code']
                        },
                        {
                            model: Size,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        const formatted = cartItems.map(item => {
            const variant = item.variant || {};
            const product = variant.Product || {};
            const color = variant.Color || {};
            const size = variant.Size || {};
            const imageUrl = product.images?.[0]?.imageUrl || null;

            return {
                cartId: item.id,
                productVariantId: variant.id,
                quantity: item.quantity,
                productName: product.name,
                price: product.price,
                color: {
                    id: color.id,
                    name: color.name,
                    hexCode: color.hexCode
                },
                size: {
                    id: size.id,
                    name: size.name
                },
                image: imageUrl
            };
        });

        return {
            data: { cart: formatted }
        };
    },
}

module.exports = CartServices;
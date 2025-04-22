import { Product, ProductVariant, ProductImage, Color, Size } from '../../models'

const ProductServices = {
    async create(req, res, next) {
        const { name, description, price, variants, isPin } = req.body;

        const newProduct = await Product.create({ name, description, price, isPin })

        for (const variant of variants) {
            const { colorId, sizes, images } = variant;

            for (const size of sizes) {
                const { sizeId, quantity } = size;

                await ProductVariant.create({
                    productId: newProduct.id,
                    colorId,
                    sizeId,
                    quantity
                });
            }

            try {
                if (images && images.length) {
                    const imageEntries = images.map(img => ({
                        productId: newProduct.id,
                        colorId,
                        imageUrl: img
                    }));

                    await ProductImage.bulkCreate(imageEntries);
                }
            } catch (err) {
                console.error('Image creation failed:', err);
            }
        }

        // Fetch product with full details
        const fullProduct = await Product.findOne({
            where: { id: newProduct.id },
            include: [
                {
                    model: ProductVariant,
                    as: 'variants',
                    include: [
                        { model: Color },
                        { model: Size }
                    ]
                },
                {
                    model: ProductImage,
                    as: 'images'
                }
            ]
        });

        return { product: fullProduct };
    },

    async update(req, res, next) {
        const { id } = req.params;
        const { name, description, price, variants } = req.body;

        const product = await Product.findByPk(id);
        if (!product) throw new Error("Product not found");

        await product.update({ name, description, price });

        // Get existing variants and images
        const existingVariants = await ProductVariant.findAll({ where: { productId: id } });
        const existingImages = await ProductImage.findAll({ where: { productId: id } });

        const incomingVariantKeys = [];
        const incomingImageKeys = [];

        for (const variant of variants) {
            const { colorId, sizes, images } = variant;

            for (const s of sizes) {
                const sizeId = s.sizeId;
                const quantity = s.quantity;
                const key = `${colorId}-${sizeId}`;
                incomingVariantKeys.push(key);

                // Check if variant exists
                const existing = existingVariants.find(v =>
                    v.colorId === colorId && v.sizeId === sizeId
                );

                if (existing) {
                    // Update quantity if changed
                    if (existing.quantity !== quantity) {
                        await existing.update({ quantity });
                    }
                } else {
                    // Create new variant
                    await ProductVariant.create({
                        productId: id,
                        colorId,
                        sizeId,
                        quantity
                    });
                }
            }

            for (const img of images) {
                const key = `${colorId}-${img}`;
                incomingImageKeys.push(key);

                const exists = existingImages.find(imgRec =>
                    imgRec.colorId === colorId && imgRec.imageUrl === img
                );

                if (!exists) {
                    await ProductImage.create({
                        productId: id,
                        colorId,
                        imageUrl: img
                    });
                }
            }
        }

        // Delete removed variants
        for (const variant of existingVariants) {
            const key = `${variant.colorId}-${variant.sizeId}`;
            if (!incomingVariantKeys.includes(key)) {
                await variant.destroy();
            }
        }

        // Delete removed images
        for (const img of existingImages) {
            const key = `${img.colorId}-${img.imageUrl}`;
            if (!incomingImageKeys.includes(key)) {
                await img.destroy();
            }
        }

        // Return updated product
        const updatedProduct = await Product.findOne({
            where: { id },
            include: [
                {
                    model: ProductVariant,
                    as: 'variants',
                    include: [
                        { model: Color },
                        { model: Size }
                    ]
                },
                {
                    model: ProductImage,
                    as: 'images'
                }
            ]
        });
        return { product: updatedProduct };
    },

    async delete(req, res, next) {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            throw new Error("Product not found");
        }

        await product.update({ isDeleted: true });
        //await product.destroy();
        return true;
    },

    async getProductDetail(req, res, next) {
        const { id } = req.query;

        const product = await Product.findOne({
            where: { id, isDeleted: false },
            include: [
                {
                    model: ProductVariant,
                    as: 'variants',
                    include: [
                        { model: Color },
                        { model: Size }
                    ]
                },
                {
                    model: ProductImage,
                    as: 'images'
                }
            ]
        });

        if (!product) throw new Error("Product not found");

        // Group by colorId
        const groupedVariants = {};
        product.variants.forEach(v => {
            const colorId = v.colorId;
            if (!groupedVariants[colorId]) {
                groupedVariants[colorId] = {
                    colorId: v.colorId,
                    color: v.Color,
                    sizes: [],
                    image: []
                };
            }
            groupedVariants[colorId].sizes.push({
                sizeId: v.sizeId,
                size: v.Size,
                quantity: v.quantity
            });
        });

        product.images.forEach(img => {
            if (groupedVariants[img.colorId]) {
                groupedVariants[img.colorId].image.push(img.imageUrl);
            }
        });

        return {
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                variants: Object.values(groupedVariants)
            }
        };
    },

    async getAllProduct(req, res, next) {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let offset = (page - 1) * limit;
        let isNextPage = false;

        const { count, rows: products } = await Product.findAndCountAll({
            where: { isDeleted: false },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: ProductVariant,
                    as: 'variants',
                    include: [
                        { model: Color },
                        { model: Size }
                    ]
                },
                {
                    model: ProductImage,
                    as: 'images'
                }
            ]
        });

        if (products.length === 0) {
            return {
                data: {
                    isNextPage: isNextPage,
                    products: []
                }
            };
        }

        if (products.length > limit) {
            isNextPage = true;
            products.pop(); // remove the extra one
        }

        const formatted = products.map(product => {
            const groupedVariants = {};

            product.variants.forEach(v => {
                const colorId = v.colorId;
                if (!groupedVariants[colorId]) {
                    groupedVariants[colorId] = {
                        colorId: v.colorId,
                        color: v.Color,
                        sizes: [],
                        image: []
                    };
                }
                groupedVariants[colorId].sizes.push({
                    variantId: v.id,
                    sizeId: v.sizeId,
                    size: v.Size,
                    quantity: v.quantity
                });
            });

            product.images.forEach(img => {
                if (groupedVariants[img.colorId]) {
                    groupedVariants[img.colorId].image.push(img.imageUrl);
                }
            });

            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                variants: Object.values(groupedVariants)
            };
        });


        return {
            data: {
                isNextPage: isNextPage,
                products: formatted
            }
        }
    },
}

module.exports = ProductServices;
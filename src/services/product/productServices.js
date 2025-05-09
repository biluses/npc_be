import { Product, ProductVariant, ProductImage, Color, Size, Category } from '../../models'
const { Op } = require("sequelize");

const ProductServices = {
    async create(req, res, next) {
        const { name, description, price, variants, isPin, categoryId } = req.body;

        const newProduct = await Product.create({ name, description, price, isPin, categoryId })

        const variantMap = new Map(); // key: `${colorId}_${sizeId}`, value: quantity
        const imageMap = new Map(); // key: colorId, value: Set of image URLs

        for (const variant of variants) {
            const { colorId, sizes, images } = variant;

            // Group quantity per (colorId, sizeId)
            for (const size of sizes) {
                const { sizeId, quantity } = size;
                const key = `${colorId}_${sizeId}`;
                variantMap.set(key, (variantMap.get(key) || 0) + quantity);

                // await ProductVariant.create({
                //     productId: newProduct.id,
                //     colorId,
                //     sizeId,
                //     quantity
                // });
            }
            // Collect unique images per colorId
            if (images && images.length) {
                if (!imageMap.has(colorId)) {
                    imageMap.set(colorId, new Set());
                }
                images.forEach(img => imageMap.get(colorId).add(img));
            }
        }

        // Create ProductVariants
        for (const [key, quantity] of variantMap.entries()) {
            const [colorId, sizeId] = key.split('_').map(Number);
            await ProductVariant.create({
                productId: newProduct.id,
                colorId,
                sizeId,
                quantity
            });
        }

        // Create ProductImages
        for (const [colorId, imageSet] of imageMap.entries()) {
            const imageEntries = Array.from(imageSet).map(img => ({
                productId: newProduct.id,
                colorId,
                imageUrl: img
            }));
            await ProductImage.bulkCreate(imageEntries);
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
        const { name, description, price, variants, categoryId } = req.body;

        const product = await Product.findByPk(id);
        if (!product) throw new Error("Product not found");

        await product.update({ name, description, price, categoryId });

        // Get existing variants and images
        const existingVariants = await ProductVariant.findAll({ where: { productId: id } });
        const existingImages = await ProductImage.findAll({ where: { productId: id } });

        const variantMap = new Map(); // key = colorId-sizeId, value = quantity
        const imageMap = new Map();   // key = colorId, value = Set of imageUrls

        for (const variant of variants) {
            const { colorId, sizes, images } = variant;

            for (const s of sizes) {
                const key = `${colorId}-${s.sizeId}`;
                variantMap.set(key, (variantMap.get(key) || 0) + s.quantity);
            }

            if (images && images.length) {
                if (!imageMap.has(colorId)) imageMap.set(colorId, new Set());
                images.forEach(img => imageMap.get(colorId).add(img));
            }
        }

        const incomingVariantKeys = Array.from(variantMap.keys());
        const incomingImageKeys = [];

        // Handle variant create/update
        for (const [key, quantity] of variantMap.entries()) {
            const [colorId, sizeId] = key.split('-').map(Number);

            const existing = existingVariants.find(v =>
                v.colorId === colorId && v.sizeId === sizeId
            );

            if (existing) {
                if (existing.quantity !== quantity) {
                    await existing.update({ quantity });
                }
            } else {
                await ProductVariant.create({
                    productId: id,
                    colorId,
                    sizeId,
                    quantity
                });
            }
        }

        // Handle image create
        for (const [colorId, imgSet] of imageMap.entries()) {
            for (const img of imgSet) {
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

    // async update(req, res, next) {
    //     const { id } = req.params;
    //     const { name, description, price, variants } = req.body;

    //     const product = await Product.findByPk(id);
    //     if (!product) throw new Error("Product not found");

    //     await product.update({ name, description, price });

    //     // Get existing variants and images
    //     const existingVariants = await ProductVariant.findAll({ where: { productId: id } });
    //     const existingImages = await ProductImage.findAll({ where: { productId: id } });

    //     const incomingVariantKeys = [];
    //     const incomingImageKeys = [];

    //     for (const variant of variants) {
    //         const { colorId, sizes, images } = variant;

    //         for (const s of sizes) {
    //             const sizeId = s.sizeId;
    //             const quantity = s.quantity;
    //             const key = `${colorId}-${sizeId}`;
    //             incomingVariantKeys.push(key);

    //             // Check if variant exists
    //             const existing = existingVariants.find(v =>
    //                 v.colorId === colorId && v.sizeId === sizeId
    //             );

    //             if (existing) {
    //                 // Update quantity if changed
    //                 if (existing.quantity !== quantity) {
    //                     await existing.update({ quantity });
    //                 }
    //             } else {
    //                 // Create new variant
    //                 await ProductVariant.create({
    //                     productId: id,
    //                     colorId,
    //                     sizeId,
    //                     quantity
    //                 });
    //             }
    //         }

    //         for (const img of images) {
    //             const key = `${colorId}-${img}`;
    //             incomingImageKeys.push(key);

    //             const exists = existingImages.find(imgRec =>
    //                 imgRec.colorId === colorId && imgRec.imageUrl === img
    //             );

    //             if (!exists) {
    //                 await ProductImage.create({
    //                     productId: id,
    //                     colorId,
    //                     imageUrl: img
    //                 });
    //             }
    //         }
    //     }

    //     // Delete removed variants
    //     for (const variant of existingVariants) {
    //         const key = `${variant.colorId}-${variant.sizeId}`;
    //         if (!incomingVariantKeys.includes(key)) {
    //             await variant.destroy();
    //         }
    //     }

    //     // Delete removed images
    //     for (const img of existingImages) {
    //         const key = `${img.colorId}-${img.imageUrl}`;
    //         if (!incomingImageKeys.includes(key)) {
    //             await img.destroy();
    //         }
    //     }

    //     // Return updated product
    //     const updatedProduct = await Product.findOne({
    //         where: { id },
    //         include: [
    //             {
    //                 model: ProductVariant,
    //                 as: 'variants',
    //                 include: [
    //                     { model: Color },
    //                     { model: Size }
    //                 ]
    //             },
    //             {
    //                 model: ProductImage,
    //                 as: 'images'
    //             }
    //         ]
    //     });
    //     return { product: updatedProduct };
    // },

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
                category: product.Category,
                variants: Object.values(groupedVariants)
            }
        };
    },

    async getAllProduct(req, res, next) {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let offset = (page - 1) * limit;
        let isNextPage = false;

        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
        const categoryId = req.query.categoryId || '';

        const where = {
            isDeleted: false
        };

        if (categoryId) {
            where.categoryId = categoryId
        }

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`
            };
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where,
            limit: limit + 1,
            offset,
            distinct: true,
            order: [[sortBy, sortOrder]],
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
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'image']
                }
            ]
        });

        if (products.length === 0) {
            return {
                data: {
                    totalCount: count,
                    currentPage: page,
                    isNextPage: isNextPage,
                    products: []
                }
            };
        }

        if (count > limit) {
            if (products[limit]) {
                isNextPage = true;
                products.pop(); // remove the extra one
            }
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
                category: product.Category,
                variants: Object.values(groupedVariants)
            };
        });


        return {
            data: {
                totalCount: count,
                currentPage: page,
                isNextPage: isNextPage,
                products: formatted
            }
        }
    },
}

module.exports = ProductServices;
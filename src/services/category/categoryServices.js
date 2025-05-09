import { Category, Product } from "../../models";
const { Op } = require("sequelize");

const CategoryServices = {
    async create(req, res, next) {
        const { name, image } = req.body;

        const category = await Category.create({
            name,
            image
        });

        return { category };
    },

    async update(req, res, next) {
        const { id } = req.params;
        const { name, image } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error("Category not found");
        }

        await category.update({ name, image });

        return { category };
    },

    async delete(req, res, next) {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error("Category not found");
        }

        // Check if category is associated with any products
        const associatedProducts = await Product.count({
            where: { categoryId: id }
        });

        if (associatedProducts > 0) {
            throw new Error("Cannot delete category as it is associated with products");
        }

        await category.destroy();
        return true;
    },

    async getCategoryDetails(req, res, next) {
        const { id } = req.params;

        const category = await Category.findOne({
            where: { id }
        });

        if (!category) {
            throw new Error("Category not found");
        }

        return { category };
    },

    async getAllCategories(req, res, next) {
        let { page, limit, search } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        const start = (page - 1) * limit;
        let isNextPage = false;

        const where = {};

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`
            };
        }

        const categories = await Category.findAll({
            where,
            offset: start,
            limit: limit + 1,
            order: [['createdAt', 'DESC']]
        });

        if (!categories || categories.length === 0) {
            return {
                data: {
                    isNextPage: false,
                    categories: []
                }
            };
        }

        if (categories.length > limit) {
            isNextPage = true;
            categories.pop();
        }

        return {
            data: {
                isNextPage,
                categories
            }
        };
    }
};

module.exports = CategoryServices; 
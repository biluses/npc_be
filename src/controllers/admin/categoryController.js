const CategoryServices = require('../../services/category/categoryServices');

const categoryController = {
    create: async (req, res, next) => {
        try {
            const categoryResponse = await CategoryServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Category created successfully !", categoryResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    update: async (req, res, next) => {
        try {
            const categoryResponse = await CategoryServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Category updated successfully !", categoryResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    delete: async (req, res, next) => {
        try {
            await CategoryServices.delete(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Category deleted successfully !");
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getCategoryDetails: async (req, res, next) => {
        try {
            const categoryResponse = await CategoryServices.getCategoryDetails(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get category details successfully !", categoryResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getAllCategories: async (req, res, next) => {
        try {
            const categoriesResponse = await CategoryServices.getAllCategories(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get categories list successfully !", categoriesResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    }
};

module.exports = categoryController; 
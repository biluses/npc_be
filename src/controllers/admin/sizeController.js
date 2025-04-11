const SizeServices = require('../../services/size/sizeServices');

const sizeController = {
    create: async (req, res, next) => {
        try {
            const sizeCreateResponse = await SizeServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Size create successfully !", sizeCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    update: async (req, res, next) => {
        try {
            const sizeUpdateResponse = await SizeServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Size update successfully !", sizeUpdateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getOne: async (req, res, next) => {
        try {
            const sizeResponse = await SizeServices.getSizeDetail(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Size get successfully !", sizeResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getAll: async (req, res, next) => {
        try {
            const allSizeResponse = await SizeServices.getAllSize(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "All size get successfully !", allSizeResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

}

module.exports = sizeController;
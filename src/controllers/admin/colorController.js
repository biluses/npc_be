const ColorServices = require('../../services/color/colorServices');

const colorController = {
    create: async (req, res, next) => {
        try {
            const colorCreateResponse = await ColorServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Color create successfully !", colorCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    update: async (req, res, next) => {
        try {
            const colorUpdateResponse = await ColorServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Color update successfully !", colorUpdateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getOne: async (req, res, next) => {
        try {
            const colorResponse = await ColorServices.getColorDetail(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Color get successfully !", colorResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getAll: async (req, res, next) => {
        try {
            const allColorResponse = await ColorServices.getAllColor(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "All color get successfully !", allColorResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

}

module.exports = colorController;
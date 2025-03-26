import { Policy } from "../../models";
const PolicyServices = require('../../services/policy/policyServices');

const policyController = {
    // Admin login(public API)
    create: async (req, res, next) => {
        try {
            const policyLoginResponse = await PolicyServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Policy create successfully !", policyLoginResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    update: async (req, res, next) => {
        try {
            const policyLoginResponse = await PolicyServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Policy update successfully !", policyLoginResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getOne: async (req, res, next) => {
        try {
            const policyLoginResponse = await PolicyServices.getPolicyDetail(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Policy get successfully !", policyLoginResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // Get Admin profile details(protected API)
    getAll: async (req, res, next) => {
        try {
            const policyProfileResponse = await PolicyServices.getAllPolicy(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "All policy get successfully !", policyProfileResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

}

module.exports = policyController;
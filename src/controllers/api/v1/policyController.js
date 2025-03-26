const PolicyServices = require('../../../services/policy/policyServices');

const policyController = {
    // Policy (public API)
    getPolicy: async (req, res, next) => {
        try {
            const policyResponse = await PolicyServices.getPolicyDetailsByType(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get policy details successfully !", policyResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

}

module.exports = policyController;
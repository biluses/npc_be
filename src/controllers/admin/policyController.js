const PolicyServices = require('../../services/policy/policyServices');

const policyController = {
    create: async (req, res, next) => {
        try {
            const policyCreateResponse = await PolicyServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Policy create successfully !", policyCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    update: async (req, res, next) => {
        try {
            const policyUpdateResponse = await PolicyServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Policy update successfully !", policyUpdateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getOne: async (req, res, next) => {
        try {
            const policyResponse = await PolicyServices.getPolicyDetail(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Policy get successfully !", policyResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    getAll: async (req, res, next) => {
        try {
            const allPolicyResponse = await PolicyServices.getAllPolicy(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "All policy get successfully !", allPolicyResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

}

module.exports = policyController;
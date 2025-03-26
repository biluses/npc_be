import { Admin, ForgotPasswordRequest } from "../../models";
const { verifyPassword, hashPassword } = require("../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../utils/jwtToken");
const AdminServices = require('../../services/admin/adminServices');

const adminController = {
    // Admin login(public API)
    login: async (req, res, next) => {
        try {
            const adminLoginResponse = await AdminServices.login(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Admin login successfully !", adminLoginResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // Get Admin profile details(protected API)
    getProfileDetails: async (req, res, next) => {
        try {
            const adminProfileResponse = await AdminServices.getProfileDetails(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Admin data get successfully !", adminProfileResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

}

module.exports = adminController;
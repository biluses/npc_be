const UserServices = require('../../../services/user/userServices');

const userController = {
    // User email check(public API)
    emailCheck: async (req, res, next) => {
        try {
            const userEmailResponse = await UserServices.emailCheck(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Email check successfully !", userEmailResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // User register(public API)
    register: async (req, res, next) => {
        try {
            const userRegisterResponse = await UserServices.register(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Register successfully !", userRegisterResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // User account verify(public API)
    verifyAccountOtp: async (req, res, next) => {
        try {
            const userVerifyOtpResponse = await UserServices.verifyAccountOtp(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Account verify successfully !", userVerifyOtpResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // User login(public API)
    login: async (req, res, next) => {
        try {
            const userLoginResponse = await UserServices.login(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Login successfully !", userLoginResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // User forgot password(public API)
    forgotPassword: async (req, res, next) => {
        try {
            const userForgotCodeResponse = await UserServices.forgotPassword(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, userForgotCodeResponse.isAccountResend == "true" || true ? "Account verify code send successfully !" : "Forgot password code send successfully !", userForgotCodeResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // User forgotCode verify(public API)
    verifyOtp: async (req, res, next) => {
        try {
            const userVerifyOtpResponse = await UserServices.verifyOtp(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "password change successfully !", userVerifyOtpResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // User reset password(public API)
    resetPassword: async (req, res, next) => {
        try {
            await UserServices.resetPassword(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Password reset successfully !");
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // Get User profile details(protected API)
    getProfileDetails: async (req, res, next) => {
        try {
            const userProfileResponse = await UserServices.getProfileDetails(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get user details successfully !", userProfileResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    // Get User profile details(protected API)
    getAllUsers: async (req, res, next) => {
        try {
            const usersResponse = await UserServices.getAllUsers(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get user list successfully !", usersResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    // Update User profile(protected API)
    updateProfile: async (req, res, next) => {
        try {
            const userProfileResponse = await UserServices.updateProfile(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Profile updated successfully !", userProfileResponse);
        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    }
}

module.exports = userController;
import { User } from "../../models";
const { verifyPassword, hashPassword } = require("../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../utils/jwtToken");
import { generateSecretId } from "../../helpers"


const UserServices = {
    async register(req, res, next) {
        const { email, password, loginType, socialId, username, profilePicture, address1, address2, city, state, postalCode } = req.body;

        let user = await User.findOne({
            where: { email, isDeleted: false }
        });

        if (!user) {
            return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "EmailId already exist");
        }

        if (loginType !== 'email' && !socialId) {
            return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "SocialId is required");
        }

        if (loginType === 'email' && !password) {
			return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "Password is required");
		}

        let userObj = {
            secretId: generateSecretId(false),
            email,
            password,
            loginType,
            username,
            profilePicture,
            address1,
            address2,
            city,
            state,
            postalCode,
            isCompletedRegister: true
        }

        if (loginType === 'google') {
			userObj.googleId = socialId;
		} else if (loginType === 'apple') {
			userObj.appleId = socialId;
		}

        const newUser = await User.create(userObj);
        let resObj = {
            user: newUser
        }

        if(loginType != "email") {
            resObj.token = issueAccessToken({
                secretId: newUser.secretId,
                loginType: "user",
            });
        }

        return resObj;
    },

    async login(req, res, next) {
        const { email, password } = req.body;
        let user = await User.findOne({
            where: { email, isDeleted: false }
        });

        if (!user) {
            return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "Incorrect Email Id");
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "Incorrect Password");
        }

        let token = issueAccessToken({
            secretId: user.secretId,
            loginType: "user",
        });

        delete user.dataValues.password;

        return {
            data: { user, token }
        };
    },

    async getProfileDetails(req, res, next) {
        const { secretId } = req.loggedInUser;
        const user = await User.findOne({
            where: {
                secretId: secretId,
                isDeleted: false
            },
            attributes: { exclude: ['password', 'isDeleted', 'updatedAt'] }
        });

        return { user: user };
    }
}

module.exports = UserServices;
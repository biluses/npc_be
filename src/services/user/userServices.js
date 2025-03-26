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

        if (user) {
            throw new Error("EmailId already exists");
        }

        if (loginType !== 'email' && !socialId) {
            throw new Error("SocialId is required");
        }

        if (loginType === 'email' && !password) {
            throw new Error("Password is required");
        }

        let userObj = {
            secretId: await generateSecretId(false),
            email,
            password: await hashPassword(password),
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
        delete newUser.dataValues.password;

        let token = issueAccessToken({
            secretId: newUser.secretId,
            loginType: "user",
        });

        return {
            data: { user: newUser, token }
        };
    },

    async login(req, res, next) {
        const { email, password } = req.body;
        let user = await User.findOne({
            where: { email, isDeleted: false }
        });

        if (!user) {
            throw new Error("Incorrect Email Id");
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect Password");
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
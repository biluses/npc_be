import { User } from "../../models";
import { generateSecretId } from "../../helpers"
const { verifyPassword, hashPassword } = require("../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../utils/jwtToken");
const { UniqueOTP } = require("unique-string-generator");
const { Op } = require("sequelize");
const path = require("path");
const ejs = require('ejs');


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

    async forgotPassword(req, res, next) {
        const { email } = req.body;

        let user = await User.findOne({
            where: { email, isDeleted: false }
        });
        if (!user) {
            throw new Error("Invalid Email");
        }

        let forgotCode = await codeGenerate();
        async function codeGenerate() {
            let generatedCode = UniqueOTP(6);
            var forgotCodeCheck = await User.findOne({ where: { forgotCode: generatedCode } })
            if (forgotCodeCheck) {
                codeGenerate();
            } else {
                let payload = {
                    forgotCode: generatedCode
                }
                await User.update(payload, {
                    where: {
                        id: user.id
                    }
                });
            }
            return generatedCode;
        }

        //send mail for otp
        // const templatePath = path.join(__dirname, '../../../../views/emails', 'send-otp-email.ejs');
        // const mail_html = await ejs.renderFile(templatePath, { otp: forgotCode, name: user.username });
        // send_mail(user.email, "Reset Password OTP for ZERO NPC Account", mail_html);

        return {
            data: { secretId: user.secretId }
        }
    },

    async verifyOtp(req, res, next) {
        const { forgotCode, secretId } = req.body;

        let user = await User.findOne({
            where: { secretId, isDeleted: false }
        });

        if (!user) {
            throw new Error("Invalid secretId");
        }

        if (forgotCode != user.forgotCode) {
            throw new Error("Invalid OTP");
        }

        await User.update({ forgotCode: null }, {
            where: {
                id: user.id
            }
        });

        return {
            data: { secretId: user.secretId }
        }
    },

    async resetPassword(req, res, next) {
        //const { secretId } = req.loggedInUser;
        const { secretId, oldPassword, newPassword } = req.body;

        let user = await User.findOne({
            where: { secretId, isDeleted: false }
        });

        if (!user) {
            throw new Error("Invalid User");
        }

        // const isMatch = await verifyPassword(oldPassword, req.loggedInUser.password);
        // if (!isMatch) {
        //     throw new Error("Incorrect Old Password");
        // }

        let payload = {
            password: await hashPassword(newPassword)
        }
        await User.update(payload, {
            where: {
                id: user.id
            }
        });

        return true
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
    },

    async getAllUsers(req, res, next) {
        const { secretId } = req.loggedInUser;

        let { page, limit, isOwn } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        const start = (page - 1) * limit;
        let isNextPage = false;

        const where = {
            isDeleted: false,
            id: { [Op.ne]: req.loggedInUser.id }
        };

        const users = await User.findAll({
            where,
            subQuery: false,
            offset: start,
            limit: limit + 1,
            attributes: {
                exclude: ['password', 'isDeleted', 'updatedAt']
            }
        });

        if (!users || users.length === 0) {
            return {
                data: {
                    isNextPage: false,
                    post: []
                }
            };
        }

        if (users.length > limit) {
            isNextPage = true;
            users.pop();
        }

        return { users };
    }
}

module.exports = UserServices;
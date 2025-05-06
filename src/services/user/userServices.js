import { User } from "../../models";
import { generateSecretId, sendMail } from "../../helpers"
const { verifyPassword, hashPassword } = require("../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../utils/jwtToken");
const { UniqueOTP } = require("unique-string-generator");
const { Op, where } = require("sequelize");
const path = require("path");
const ejs = require('ejs');


const UserServices = {
    async emailCheck(req, res, next) {
        const { email } = req.body;

        let user = await User.findOne({
            where: { email, isDeleted: false }
        });

        return {
            data: { isUnique: user ? false : true }
        };
    },

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

        let verificationToken = UniqueOTP(6)
        let userObj = {
            secretId: await generateSecretId(false),
            email,
            loginType,
            username,
            profilePicture,
            address1,
            address2,
            city,
            state,
            postalCode,
            isCompletedRegister: loginType == "email" ? false : true,
            verificationToken
        }

        if (loginType === 'google') {
            userObj.googleId = socialId;
        } else if (loginType === 'apple') {
            userObj.appleId = socialId;
        } else if (loginType == 'email') {
            userObj.password = await hashPassword(password)
        }

        let newUser = await User.create(userObj);

        if (loginType == "email") {
            //send mail for otp
            const templatePath = path.join(__dirname, '../../../views/emails', 'send-otp-email.ejs');
            const mail_html = await ejs.renderFile(templatePath, { otp: verificationToken, name: username });
            sendMail(email, "Verify account OTP for ZERO NPC Account", mail_html);
        }

        if (loginType == "email") {
            return {
                // data: { user: newUser, token }
                data: { secretId: newUser.secretId }
            };
        } else {
            delete newUser.dataValues.password;

            let token = issueAccessToken({
                secretId: newUser.secretId,
                loginType: "user",
            });
            return {
                data: { user: newUser, token }
            };
        }
    },

    async verifyAccountOtp(req, res, next) {
        const { secretId, verificationToken } = req.body;

        let user = await User.findOne({
            where: { secretId, isDeleted: false }
        });

        if (!user) {
            throw new Error("Invalid secretId");
        }

        if (verificationToken != user.verificationToken) {
            throw new Error("Invalid OTP");
        }

        await User.update({ verificationToken: null, isCompletedRegister: true }, {
            where: {
                id: user.id
            }
        });

        let newUser = await User.findOne({
            where: {
                id: user.id
            }
        })
        delete newUser.dataValues.password;

        let token = issueAccessToken({
            secretId: newUser.secretId,
            loginType: "user",
        });

        return {
            data: { user: newUser, token }
        }
    },

    async login(req, res, next) {
        const { email, password, loginType, socialId } = req.body;
        let user = await User.findOne({
            where: { email, isDeleted: false }
        });

        if (!user) {
            throw new Error("Incorrect Email Id");
        }

        if (!user.isCompletedRegister) {
            throw new Error("Your account is not verify");
        }

        if (loginType == "email") {
            if(!password) {
                throw new Error("Password is required");
            }

            const isMatch = await verifyPassword(password, user.password);
            if (!isMatch) {
                throw new Error("Incorrect Password");
            }
        } else if (loginType === 'facebook' || loginType === 'apple' || loginType === 'google') {
            if(!socialId) {
                throw new Error("socialId is required");
            }

            let updateSocialMediaIdData = {}
            if (inputs.loginType === 'google') {
				updateSocialMediaIdData.googleToken = inputs.socialId;
			} else if (inputs.loginType === 'apple') {
				updateSocialMediaIdData.appleToken = inputs.socialId;
			}

            await User.update(updateSocialMediaIdData, {
                where: {
                    id: user.id
                }
            });
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
        const { email, isAccountResend = false } = req.body;

        let user = await User.findOne({
            where: { email, isDeleted: false }
        });
        if (!user) {
            throw new Error("Invalid Email");
        }

        let forgotCode = await codeGenerate();
        async function codeGenerate() {
            let generatedCode = UniqueOTP(6);
            let where = {}
            console.log('isAccountResend', isAccountResend)
            if (isAccountResend) {
                where.verificationToken = generatedCode
            } else {
                where.forgotCode = generatedCode
            }
            var forgotCodeCheck = await User.findOne({ where: where })
            if (forgotCodeCheck) {
                codeGenerate();
            } else {
                // let payload = {
                //     forgotCode: generatedCode
                // }
                await User.update(where, {
                    where: {
                        id: user.id
                    }
                });
            }
            return generatedCode;
        }

        //send mail for otp
        const templatePath = path.join(__dirname, '../../../views/emails', 'send-otp-email.ejs');
        const mail_html = await ejs.renderFile(templatePath, { otp: forgotCode, name: user.username });
        sendMail(user.email, isAccountResend ? "Account verify otp for ZERO NPC Account" : "Reset Password OTP for ZERO NPC Account", mail_html);

        return {
            data: { secretId: user.secretId, isAccountResend }
        }
    },

    async verifyOtp(req, res, next) {
        const { forgotCode, secretId, newPassword } = req.body;

        let user = await User.findOne({
            where: { secretId, isDeleted: false }
        });

        if (!user) {
            throw new Error("Invalid secretId");
        }

        if (forgotCode != user.forgotCode) {
            throw new Error("Invalid OTP");
        }

        let payload = {
            password: await hashPassword(newPassword),
            forgotCode: null
        }

        await User.update(payload, {
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
            if (users[limit]) {
                isNextPage = true;
                users.pop();
            }
        }

        return { users };
    }
}

module.exports = UserServices;
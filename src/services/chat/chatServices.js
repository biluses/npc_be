import { User, Chat, sequelize } from "../../models";
const { Op, Sequelize } = require("sequelize");

const ChatServices = {
    async sendMessage(req, res, next) {
        const { tokenId, receiverId, message } = req.body;
        const senderId = req.loggedInUser.id;
        const receiverSocketData = activeUsers.find((user) => {
            return user.userId == receiverId
        })

        const senderSocketData = activeUsers.find((user) => {
            return user.userId == senderId
        })

        if (senderId == receiverId) {
            throw new Error("Invalid ReceiverId");
        }

        const reciverData = await User.findOne({
            where: {
                id: receiverId,
                isDeleted: false,
            }
        })

        if (!reciverData) {
            throw new Error("Invalid ReceiverId");
        }

        const objChat = {
            senderId,
            receiverId,
            tokenId,
            message,
            messageType: "text"
        };

        if (reciverData.inChatUserId == senderId) {
            objChat.messageStatus = "read"
        } else if (receiverSocketData?.userId == receiverId) {
            objChat.messageStatus = "deliver"
        } else {
            objChat.messageStatus = "sent"
        }
        const createChat = await Chat.create(objChat);
        if (receiverSocketData?.socketId && senderSocketData?.socketId) {
            io.to([senderSocketData?.socketId, receiverSocketData?.socketId]).emit(
                "send-message",
                createChat
            );
        } else {
            io.to(senderSocketData?.socketId).emit(
                "send-message",
                createChat
            );
        }
        return {
            data: { chat: createChat }
        };
    },

    async getChatList(req, res, next) {
        let page = req.body.page ? parseInt(req.body.page) : 1;
        let limit = req.body.limit ? parseInt(req.body.limit) : 10;
        let skip = (page - 1) * limit;
        let isNextPage = false;

        //rawQuery
        let rawQuery = `SELECT c.*,u.id as userId,u.username,u.email,u.profilePicture from chats as c
        LEFT JOIN users AS u ON (c.senderId=${req.loggedInUser.id} AND c.receiverId =u.id) OR (c.senderId=u.id AND c.receiverId =${req.loggedInUser.id})
         WHERE c.id IN(SELECT MAX(chats.id) FROM chats WHERE ((chats.receiverId=${req.loggedInUser.id} and chats.senderId=u.id) OR (chats.senderId=${req.loggedInUser.id} and chats.receiverId = u.id)))`;

        if (req.body.searchValue) {
            listDataQuery += ` AND u.username LIKE "%${inputs.searchValue}%"`
        }

        rawQuery += ` ORDER BY createdAt DESC LIMIT ${skip},${limit + 1}`

        const rows = await sequelize.query(rawQuery, {
            type: Sequelize.QueryTypes.SELECT,
        });

        if (rows.length === 0) {
            return {
                data: {
                    isNextPage: isNextPage,
                    chat: []
                }
            };
        }

        if (page && limit) {
            if (rows[limit]) {
                isNextPage = true;
                rows.pop();
            }
        }

        for (const item of rows) {
            // item.messageType == "buyNFT" || item.messageType == "acceptInvitation" ? item.message = "" : item.message
            const badgeCount = await Chat.count({
                where: {
                    senderId: item.userId,
                    receiverId: req.loggedInUser.id,
                    messageStatus: { [Op.in]: ['deliver', 'sent'] }
                }
            });
            item.unReadCount = badgeCount
        }

        return {
            data: { chat: rows }
        };
    },

    async getMessageList(req, res, next) {
        const userId = req.query.userId
        // const tokenId = req.query.tokenId
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let start = (page - 1) * limit;

        const findChat = await Chat.findAll({
            limit: limit,
            offset: start,
            where: {
                //tokenId
                [Op.or]: [
                    { receiverId: req.loggedInUser.id, senderId: userId },
                    { senderId: req.loggedInUser.id, receiverId: userId },
                ],
            },
            order: [["createdAt", "desc"]],
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "username", "email", "profilePicture"],
                    required: false,

                },
                {
                    model: User,
                    as: "receiver",
                    attributes: ["id", "username", "email", "profilePicture"],
                    required: false,

                },
            ],
        });

        return {
            data: { chat: findChat }
        }
    },

    async inOutStatus(req, res, next) {

        const { inChatUserId } = req.body;
        const userId = req.loggedInUser.id;

        if (inChatUserId) {
            const userData = await User.findOne({
                where: {
                    id: inChatUserId,
                    isDeleted: false,
                }
            })

            if (!userData) {
                throw new Error("Invalid inChatUserId!!");
            }

            await Chat.update(
                {
                    messageStatus: "read",
                },
                {
                    where: {
                        senderId: inChatUserId,
                        receiverId: userId,
                        messageStatus: { [Op.in]: ['deliver', 'sent'] }
                    }
                }
            );

            const socketData = activeUsers.find((user) => {
                return user.userId == inChatUserId
            })
            //send socket to opposite user
            io.to(socketData?.socketId).emit("read-message");
        }

        await User.update(
            { inChatUserId: inChatUserId },
            { where: { id: userId } }
        )

        return true
    }
}

module.exports = ChatServices;
const ChatServices = require('../../../services/chat/chatServices');

const chatController = {
    // POST sendMessage(protected API)
    sendMessage: async (req, res, next) => {
        try {
            const chatsendMessageResponse = await ChatServices.sendMessage(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Message send successfully !", chatsendMessageResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET getChatList(protected API)
    getChatList: async (req, res, next) => {
        try {
            const chatListResponse = await ChatServices.getChatList(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get chat successfully !", chatListResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET getMessageList(protected API)
    getMessageList: async (req, res, next) => {
        try {
            const chatMessageListResponse = await ChatServices.getMessageList(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get message successfully !", chatMessageListResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // POST inOutStatus(protected API)
    inOutStatus: async (req, res, next) => {
        try {
            const chatStatusResponse = await ChatServices.inOutStatus(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "update message status successfully !", chatStatusResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
}

module.exports = chatController;
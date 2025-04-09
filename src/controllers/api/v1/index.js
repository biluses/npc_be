
const userController = require('./userController');
const policyController = require('./policyController')
const postController = require('./postController')
const chatController = require('./chatController')

const apiModuleController = {
    userController: userController,
    policyController: policyController,
    postController: postController,
    chatController: chatController
}

module.exports = apiModuleController;
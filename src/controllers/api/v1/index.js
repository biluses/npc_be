
const userController = require('./userController');
const policyController = require('./policyController')
const postController = require('./postController')

const apiModuleController = {
    userController: userController,
    policyController: policyController,
    postController: postController
}

module.exports = apiModuleController;
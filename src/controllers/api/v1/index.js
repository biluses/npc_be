
const userController = require('./userController');
const policyController = require('./policyController')

const apiModuleController = {
    userController: userController,
    policyController: policyController
}

module.exports = apiModuleController;
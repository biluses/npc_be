
const adminController = require('./adminController');
const policyController = require('./policyController')

const adminModuleController = {
    adminController: adminController,
    policyController: policyController
}

module.exports = adminModuleController;
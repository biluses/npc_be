
const adminController = require('./adminController');
const policyController = require('./policyController')
const colorController = require('./colorController')
const sizeController = require('./sizeController')
const productController = require('./productController')

const adminModuleController = {
    adminController: adminController,
    policyController: policyController,
    colorController: colorController,
    sizeController: sizeController,
    productController: productController
}

module.exports = adminModuleController;
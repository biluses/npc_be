
const adminController = require('./adminController');
const policyController = require('./policyController')
const colorController = require('./colorController')
const sizeController = require('./sizeController')
const productController = require('./productController')
const orderController = require('./orderController')

const adminModuleController = {
    adminController: adminController,
    policyController: policyController,
    colorController: colorController,
    sizeController: sizeController,
    productController: productController,
    orderController: orderController
}

module.exports = adminModuleController;
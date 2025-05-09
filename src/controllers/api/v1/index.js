const userController = require('./userController')
const policyController = require('./policyController')
const postController = require('./postController')
const chatController = require('./chatController')
const cartController = require('./cartController')
const orderController = require('./orderController')
const productController = require('./productController')

const apiModuleController = {
    userController: userController,
    policyController: policyController,
    postController: postController,
    chatController: chatController,
    cartController: cartController,
    orderController: orderController,
    productController: productController
}

module.exports = apiModuleController;
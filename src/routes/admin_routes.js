const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');

const dataValidator = require("../validator")
const adminModuleController = require("../controllers/admin")

// =============================================================================================================================
// ================================================= ADMIN MODULE APIs =========================================================
// =============================================================================================================================

// admin APIs
router.get('/get-profile', adminModuleController.adminController.getProfileDetails);

// category APIs
router.post('/category/create', adminModuleController.categoryController.create);
router.patch('/category/update/:id', adminModuleController.categoryController.update);
router.delete('/category/delete/:id', adminModuleController.categoryController.delete);
router.get('/category/get-category-details/:id', adminModuleController.categoryController.getCategoryDetails);

// policy APIs
// router.post('/create-policy', adminModuleController.policyController.create);
router.patch('/policy/update-policy/:id', validate(dataValidator.policyValidator.updatePolicyValidationSchema), adminModuleController.policyController.update);
router.get('/policy/get-policy', adminModuleController.policyController.getOne);
router.get('/policy/get-all-policy', adminModuleController.policyController.getAll);

// color APIs
router.post('/color/create-color', adminModuleController.colorController.create);
router.patch('/color/update-color/:id', validate(dataValidator.colorValidator.updateColorValidationSchema), adminModuleController.colorController.update);
router.delete('/color/:id', adminModuleController.colorController.delete);
router.get('/color/get-color', adminModuleController.colorController.getOne);
router.get('/color/get-all-color', adminModuleController.colorController.getAll);

// size APIs
router.post('/size/create-size', adminModuleController.sizeController.create);
router.patch('/size/update-size/:id', validate(dataValidator.sizeValidator.updateSizeValidationSchema), adminModuleController.sizeController.update);
router.delete('/size/:id', adminModuleController.sizeController.delete);
router.get('/size/get-size', adminModuleController.sizeController.getOne);
router.get('/size/get-all-size', adminModuleController.sizeController.getAll);

// product APIs
router.post('/product/create-product', validate(dataValidator.productValidator.createProductValidationSchema), adminModuleController.productController.create);
router.patch('/product/update-product/:id', validate(dataValidator.productValidator.updateProductValidationSchema), adminModuleController.productController.update);
router.delete('/product/:id', adminModuleController.productController.delete);
router.get('/product/get-product', adminModuleController.productController.getOne);
router.get('/product/get-all-product', adminModuleController.productController.getAll);

// order APIs
router.get('/orders/all-orders', adminModuleController.orderController.getAllOrders);
router.post('/orders/update-status', adminModuleController.orderController.updateOrderStatus)

module.exports = router;

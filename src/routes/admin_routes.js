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

// policy APIs
// router.post('/create-policy', adminModuleController.policyController.create);
router.patch('/policy/update-policy/:id', validate(dataValidator.policyValidator.updatePolicyValidationSchema), adminModuleController.policyController.update);
router.get('/policy/get-policy', adminModuleController.policyController.getOne);
router.get('/policy/get-all-policy', adminModuleController.policyController.getAll);

// color APIs
router.post('/color/create-color', adminModuleController.colorController.create);
router.patch('/color/update-color/:id', validate(dataValidator.colorValidator.updateColorValidationSchema), adminModuleController.colorController.update);
router.get('/color/get-color', adminModuleController.colorController.getOne);
router.get('/color/get-all-color', adminModuleController.colorController.getAll);

// size APIs
router.post('/size/create-size', adminModuleController.sizeController.create);
router.patch('/size/update-size/:id', validate(dataValidator.sizeValidator.updateSizeValidationSchema), adminModuleController.sizeController.update);
router.get('/size/get-size', adminModuleController.sizeController.getOne);
router.get('/size/get-all-size', adminModuleController.sizeController.getAll);

// product APIs
router.post('/product/create-product', adminModuleController.productController.create);
router.patch('/product/update-product/:id', adminModuleController.productController.update);
router.get('/product/get-product', adminModuleController.productController.getOne);
router.get('/product/get-all-product', adminModuleController.productController.getAll);

module.exports = router;

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

module.exports = router;

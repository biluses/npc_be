const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');

const dataValidator = require("../validator")
const adminModuleController = require("../controllers/admin")

// =============================================================================================================================
// ================================================= ADMIN MODULE APIs =========================================================
// =============================================================================================================================

// admin APIs
router.get('/admin/get-profile', adminModuleController.adminController.getProfileDetails);

module.exports = router;

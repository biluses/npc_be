const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');
const adminRoutes = require('./admin_routes');
router.use(adminRoutes);

const dataValidator = require("../../src/validator")
const APIController = require("../../src/controllers/api/v1")
// const adminModuleController = require("../../src/controllers/admin")

// User APIs
router.get('/user/get-profile', APIController.userController.getProfileDetails);

module.exports = router;

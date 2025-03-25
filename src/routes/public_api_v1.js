// routes/routes.js
const express = require('express');
const router = express.Router();

const { validate } = require('express-validation');

const dataValidator = require("../../src/validator")
const adminModuleController = require("../../src/controllers/admin")
const APIController = require("../../src/controllers/api/v1")

// Admin APIs
router.post('/admin/auth/login', validate(dataValidator.adminValidator.adminLoginValidationSchema), adminModuleController.adminController.login);

// User APIs
router.post('/user/auth/login', validate(dataValidator.userValidator.userLoginValidationSchema), APIController.userController.login);
router.post('/user/auth/register', validate(dataValidator.userValidator.userRegisterValidationSchema), APIController.userController.register);

module.exports = router;

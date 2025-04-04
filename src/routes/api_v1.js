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

// POST APIs
router.post('/post/create-post', APIController.postController.create);
router.patch('/post/update-post/:id', APIController.postController.update);
router.delete('/post/delete-post/:id', APIController.postController.delete);
router.get('/post/get-post-details', APIController.postController.postDetails);
router.get('/post/get-all-post', APIController.postController.getAllPost);
router.post('/post/like-unlike', APIController.postController.postLikeUnlike);
router.post('/post/create-comment', APIController.postController.postComment);
router.get('/post/get-post-comments', APIController.postController.getPostComment);
module.exports = router;

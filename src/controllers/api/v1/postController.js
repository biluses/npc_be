const PostServices = require('../../../services/post/postServices');

const postController = {
    // POST create(protected API)
    create: async (req, res, next) => {
        try {
            const postCreateResponse = await PostServices.create(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Post create successfully !", postCreateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // PATCH update(protected API)
    update: async (req, res, next) => {
        try {
            const postUpdateResponse = await PostServices.update(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Post update successfully !", postUpdateResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // DELETE delete(protected API)
    delete: async (req, res, next) => {
        try {
            const postDeleteResponse = await PostServices.delete(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Post deleted successfully !", postDeleteResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET post details(protected API)
    postDetails: async (req, res, next) => {
        try {
            const postResponse = await PostServices.postDetails(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get post details successfully !", postResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // GET get all post(protected API)
    getAllPost: async (req, res, next) => {
        try {
            const postResponse = await PostServices.getAllPost(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get all post successfully !", postResponse);
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // POST post like-unlike(protected API)
    postLikeUnlike: async (req, res, next) => {
        try {
            const postLikeResponse = await PostServices.postLikeUnlike(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, postLikeResponse.data.isLike ? "Post like successfully !" : "Post unlike successfully !", postLikeResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    // POST add comment(protected API)
    postComment: async (req, res, next) => {
        try {
            const postLikeResponse = await PostServices.postComment(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Post comment successfully !", postLikeResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    // GET get post comments(protected API)
    getPostComment: async (req, res, next) => {
        try {
            const postCommentResponse = await PostServices.getPostComment(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Get post comment successfully !", postCommentResponse);

        } catch (error) {
            console.log('error', error)
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },
}

module.exports = postController;
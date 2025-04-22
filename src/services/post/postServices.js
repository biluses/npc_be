import { Post, PostLike, PostComment } from "../../models";
import { buildCommentTree } from "../../helpers"
const { Op, fn, col, literal } = require("sequelize");

const PostServices = {
    async create(req, res, next) {
        const { postImage, caption, withUserId = null } = req.body;

        let postObj = {
            userId: req.loggedInUser.id,
            withUserId,
            postImage,
            caption
        }

        const newPost = await Post.create(postObj);
        return {
            data: { post: newPost }
        };
    },

    async update(req, res, next) {
        const { postImage, caption, withUserId = null } = req.body;

        const checkPost = await Post.findOne({
            where: {
                id: req.params.id,
                userId: req.loggedInUser.id
            },
        });

        if (!checkPost) {
            throw new Error("Invalid postId");
        }

        let postObj = {
            withUserId,
            postImage,
            caption
        }

        await Post.update(postObj, {
            where: {
                id: req.params.id
            }
        });

        const post = await Post.findOne({
            where: {
                id: req.params.id,
            },
        });

        return {
            data: { post }
        };
    },

    async delete(req, res, next) {
        let post = await Post.findOne({
            where: { id: req.params.id, userId: req.loggedInUser.id, isDeleted: false }
        });
        if (!post) {
            throw new Error("Invalid postId");
        }

        await Post.destroy({
            where: { id: req.params.id }
        })

        return true
    },

    async postDetails(req, res, next) {

        let post = await Post.findOne({
            where: { id: req.query.postId, isDeleted: false },
            subQuery: false,
            attributes: {
                include: [
                    [fn('COUNT', col('PostLikes.id')), 'likeCount'],
                    [fn('COUNT', col('comments.id')), 'commentCount']
                ]
            },
            include: [
                {
                    model: PostLike,
                    as: 'PostLikes', // important alias
                    attributes: [],
                    required: false
                },
                {
                    model: PostComment,
                    as: 'comments',
                    attributes: [],
                    required: false
                },
                {
                    model: PostLike,
                    as: 'UserLike',
                    where: { userId: req.loggedInUser.id },
                    attributes: ['id'],
                    required: false
                }
            ],
            group: ['Post.id', 'UserLike.id']
        });

        if (!post) {
            throw new Error("Invalid postId");
        }

        const data = post.toJSON();
        data.likeCount = Number(data.likeCount || 0);
        data.commentCount = Number(data.commentCount || 0);
        data.isLike = data.UserLike.length > 0 ? true : false;
        delete data.UserLike;

        return {
            data: { post: data }
        }
    },

    async getAllPost(req, res, next) {
        let { page, limit, isOwn } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        const start = (page - 1) * limit;
        let isNextPage = false;

        const where = {
            isDeleted: false,
            userId: isOwn === "true" ? req.loggedInUser.id : { [Op.ne]: req.loggedInUser.id }
        };

        const posts = await Post.findAll({
            where,
            subQuery: false,
            offset: start,
            limit: limit + 1,
            attributes: {
                include: [
                    [fn('COUNT', col('PostLikes.id')), 'likeCount'],
                    [fn('COUNT', col('comments.id')), 'commentCount']
                ]
            },
            include: [
                {
                    model: PostLike,
                    as: 'PostLikes', // important alias
                    attributes: [],
                    required: false
                },
                {
                    model: PostComment,
                    as: 'comments',
                    attributes: [],
                    required: false
                },
                {
                    model: PostLike,
                    as: 'UserLike',
                    where: { userId: req.loggedInUser.id },
                    attributes: ['id'],
                    required: false
                }
            ],
            group: ['Post.id', 'UserLike.id']
        });

        if (!posts || posts.length === 0) {
            return {
                data: {
                    isNextPage: false,
                    post: []
                }
            };
        }

        if (posts.length > limit) {
            isNextPage = true;
            posts.pop();
        }

        const formattedPosts = posts.map(post => {
            const data = post.toJSON();
            data.likeCount = Number(data.likeCount || 0);
            data.commentCount = Number(data.commentCount || 0);
            data.isLike = data.UserLike.length > 0 ? true : false;
            delete data.UserLike;
            return data;
        });


        return {
            data: {
                isNextPage,
                post: formattedPosts
            }
        };
    },

    async postLikeUnlike(req, res, next) {
        const post = await Post.findOne({
            where: {
                id: req.body.postId,
                isDeleted: false
            },
        });

        if (!post) {
            throw new Error("Invalid postId");
        }

        const isPostLike = await PostLike.findOne({
            where: { postId: req.body.postId, userId: req.loggedInUser.id }
        })

        if (isPostLike) {
            await PostLike.destroy({
                where: { id: isPostLike.id }
            })

            return {
                data: { isLike: false }
            };
        }

        await PostLike.create({
            postId: req.body.postId,
            userId: req.loggedInUser.id
        })

        return {
            data: { isLike: true }
        };
    },

    async postComment(req, res, next) {
        const { postId, comment, parentId = null } = req.body;

        const comments = await PostComment.create({
            postId,
            userId: req.loggedInUser.id,
            comment,
            parentId,
        });


        return {
            data: {
                comment: comments
            }
        };
    },

    async getPostComment(req, res, next) {
        const postId = req.query.postId;

        const allComments = await PostComment.findAll({
            where: { postId },
            order: [['createdAt', 'ASC']],
            raw: true
        });

        // Build nested comment tree
        const nestedComments = buildCommentTree(allComments);
        return {
            data: { comments: nestedComments }
        }
    }
}

module.exports = PostServices;
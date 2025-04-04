module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        'Post',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            withUserId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            postImage: {
                type: DataTypes.STRING,
                allowNull: true
            },
            caption: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            tableName: "post",
            timestamps: true
        }
    );

    Post.associate = function (models) {
        // associations can be defined here
        Post.belongsTo(models.User, { foreignKey: "userId" });
        Post.hasMany(models.PostLike, { foreignKey: 'postId', as: 'PostLikes' });
        Post.hasMany(models.PostComment, { foreignKey: 'postId', as: 'comments' });
        Post.hasMany(models.PostLike, { as: 'UserLike', foreignKey: 'postId' });
        // Post.belongsTo(models.User, { foreignKey: "withUserId" });
    };

    return Post;
};

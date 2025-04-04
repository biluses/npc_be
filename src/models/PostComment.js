module.exports = (sequelize, DataTypes) => {
    const PostComment = sequelize.define(
        'PostComment',
        {
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            tableName: "postComment",
            timestamps: true
        }
    );

    PostComment.associate = function (models) {
        // associations can be defined here
        PostComment.belongsTo(models.User, { foreignKey: "userId" });
        PostComment.belongsTo(models.Post, { foreignKey: "postId" });
        PostComment.hasMany(models.PostComment, { foreignKey: 'parentId', as: 'replies' });
        PostComment.belongsTo(models.PostComment, { foreignKey: 'parentId', as: 'parent' });
    };

    return PostComment;
};

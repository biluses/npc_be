module.exports = (sequelize, DataTypes) => {
    const PostLike = sequelize.define(
        'PostLike',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            tableName: "postLike",
            timestamps: true
        }
    );

    PostLike.associate = function (models) {
        // associations can be defined here
        PostLike.belongsTo(models.User, { foreignKey: "userId" });
        PostLike.belongsTo(models.Post, { foreignKey: "postId" })
    };

    return PostLike;
};

module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define(
        'Chat',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tokenId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            message: {
                type: DataTypes.STRING,
                allowNull: true
            },
            messageType: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isIn: [["text", "video", "audio", "image"]],
                },
            },
            messageData: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            vedioThumbnail: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            messageStatus: {
                type: DataTypes.INTEGER,
                defaultValue: 'sent',
                validate: {
                    isIn: [["sent", "deliver", "read"]],
                },
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
            scopes: {
                withSecretColumns: {
                    attributes: { include: ['password'] },
                },
            },
            tableName: "chats",
            timestamps: true
        }
    );

    Chat.associate = function (models) {
        // associations can be defined here
        Chat.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
        Chat.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
        // Chat.belongsTo(models.Token, { foreignKey: "tokenId" });
    };

    return Chat;
};

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
        'OrderItem',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productVariantId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
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
            tableName: "orderItem",
            timestamps: true
        }
    );

    OrderItem.associate = function (models) {
        // associations can be defined here
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
        OrderItem.belongsTo(models.User, { foreignKey: 'userId' });
        OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
        OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'productVariantId' });
    };

    return OrderItem;
};

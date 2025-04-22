module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        'Order',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            orderNo: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: 1 //1= pending
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            totalAmount: {
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
            tableName: "order",
            timestamps: true
        }
    );

    Order.associate = function (models) {
        // associations can be defined here
        Order.belongsTo(models.User, { foreignKey: 'userId' });
        Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    };

    return Order;
};

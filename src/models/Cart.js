module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define(
        'Cart',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            productVariantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false
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
            tableName: "cart",
            timestamps: true
        }
    );

    Cart.associate = function (models) {
        // associations can be defined here
        Cart.belongsTo(models.User, { foreignKey: 'userId' });
        Cart.belongsTo(models.ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });
    };

    return Cart;
};

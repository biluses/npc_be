module.exports = (sequelize, DataTypes) => {
    const ProductVariant = sequelize.define(
        'ProductVariant',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            colorId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            sizeId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0
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
            tableName: "productVariant",
            timestamps: true
        }
    );

    ProductVariant.associate = function (models) {
        // associations can be defined here
        ProductVariant.belongsTo(models.Product, { foreignKey: 'productId' });
        ProductVariant.belongsTo(models.Color, { foreignKey: 'colorId' });
        ProductVariant.belongsTo(models.Size, { foreignKey: 'sizeId' });
    };

    return ProductVariant;
};

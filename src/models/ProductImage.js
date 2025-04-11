module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define(
        'ProductImage',
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
            imageUrl: {
                type: DataTypes.STRING,
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
            tableName: "productImage",
            timestamps: true
        }
    );

    ProductImage.associate = function (models) {
        // associations can be defined here
        ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
        ProductImage.belongsTo(models.Color, { foreignKey: 'colorId' });
    };

    return ProductImage;
};

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        'Product',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: DataTypes.TEXT,
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            isPin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
            tableName: "product",
            timestamps: true
        }
    );

    Product.associate = function (models) {
        // associations can be defined here
        Product.hasMany(models.ProductVariant, { foreignKey: 'productId', as: 'variants' });
        Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
        Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
    };

    return Product;
};

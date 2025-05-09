module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        'Category',
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
            image: {
                type: DataTypes.STRING,
                allowNull: true
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
            tableName: "categories",
            timestamps: true
        }
    );

    Category.associate = function (models) {
        // associations can be defined here
        Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    };

    return Category;
}; 
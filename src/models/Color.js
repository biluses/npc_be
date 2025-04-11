module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define(
        'Color',
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
            code: {
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
            tableName: "color",
            timestamps: true
        }
    );

    Color.associate = function (models) {
        // associations can be defined here
        Color.hasMany(models.ProductVariant, { foreignKey: 'colorId' });
        Color.hasMany(models.ProductImage, { foreignKey: 'colorId' });
    };

    return Color;
};

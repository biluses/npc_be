module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define(
        'Size',
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
            tableName: "size",
            timestamps: true
        }
    );

    Size.associate = function (models) {
        // associations can be defined here
        Size.hasMany(models.ProductVariant, { foreignKey: 'sizeId' });
    };

    return Size;
};

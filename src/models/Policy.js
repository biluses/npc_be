module.exports = (sequelize, DataTypes) => {
    const AllPolicy = sequelize.define(
        'AllPolicy',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING,
                validate: {
                    isIn: [["1", "2", "3"]], // 1= privacy policy, 2=legal, 3=cookies
                },
            },
            description: {
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
            tableName: "allPolicy",
            timestamps: true
        }
    );

    AllPolicy.associate = function (models) {
        // associations can be defined here
    };

    return AllPolicy;
};

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            secretId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            loginType: {
                type: DataTypes.STRING,
                defaultValue: "email",
				validate: {
					isIn: [["email", "apple", "google"]],
				},
            },
            googleId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            appleId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            profilePicture: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address1: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address2: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            postalCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            verificationToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            forgotCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isCompletedRegister: {
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
            scopes: {
                withSecretColumns: {
                    attributes: { include: ['password'] },
                },
            },
            tableName: "users",
            timestamps: true
        }
    );

    User.associate = function (models) {
        // associations can be defined here
        User.hasMany(models.Cart, { foreignKey: 'userId', as: 'cartItems' });
    };

    return User;
};

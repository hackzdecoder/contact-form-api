// models/PersonalAccessToken.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class PersonalAccessToken extends Model {
        static associate(models) {
            PersonalAccessToken.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user"
            });
        }
    }

    PersonalAccessToken.init(
        {
            token_id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: DataTypes.STRING,
            abilities: DataTypes.STRING,
            expires_at: DataTypes.DATE,
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "personalAccessToken",
            tableName: "personal_access_tokens",
        }
    );

    return PersonalAccessToken;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ContactPerson extends Model {
        static associate() { }
    }

    ContactPerson.init(
        {
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            contact_no: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ContactPerson",
            tableName: "contact_persons",
            timestamps: true,
        }
    );

    return ContactPerson;
};

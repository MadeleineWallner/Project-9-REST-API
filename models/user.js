const { DataTypes } = require("sequelize/dist");
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        emailAddress: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },        
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, { 
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }, 
         });
    }
    return User;
}
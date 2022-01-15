const { DataTypes } = require("sequelize/dist");
const Sequelize = require('sequelize');

module.exports = ( sequelize ) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        estimatedTime: {
            type: Sequelize.STRING
        },
        materialsNeeded: {
            type: Sequelize.STRING
        },
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, { 
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    }
    return Course;
}
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    emergencyContact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bloodType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    allergies: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Patient;
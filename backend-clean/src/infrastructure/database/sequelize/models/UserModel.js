const { DataTypes } = require('sequelize');

let UserModel = null;

function initialize(sequelize) {
    UserModel = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('patient', 'dentist', 'admin'),
            allowNull: false,
            defaultValue: 'patient',
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        specialty: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });

    return UserModel;
}

function getModel() {
    if (!UserModel) {
        throw new Error('UserModel not initialized. Call initialize() first.');
    }
    return UserModel;
}

module.exports = {
    initialize,
    getModel,
};
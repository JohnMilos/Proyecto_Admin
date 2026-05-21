const { DataTypes } = require('sequelize');

let PenaltyModel = null;

function initialize(sequelize) {
    PenaltyModel = sequelize.define('Penalty', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reason: {
            type: DataTypes.ENUM('late_cancellation', 'no_show', 'other'),
            allowNull: false,
            defaultValue: 'other',
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'paid'),
            allowNull: false,
            defaultValue: 'active',
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'penalties',
        timestamps: true,
    });

    return PenaltyModel;
}

function getModel() {
    if (!PenaltyModel) {
        throw new Error('PenaltyModel not initialized. Call initialize() first.');
    }
    return PenaltyModel;
}

module.exports = {
    initialize,
    getModel,
};
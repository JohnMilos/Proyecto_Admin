const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

/**
 * Modelo de Penalización
 *
 * Registra penalizaciones por cancelaciones tardías o no-show
 * Ayuda a controlar el comportamiento de los pacientes
 */
const Penalty = sequelize.define('Penalty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la penalización'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        comment: 'ID del usuario penalizado'
    },
    reason: {
        type: DataTypes.ENUM('late_cancellation', 'no_show', 'other'),
        allowNull: false,
        defaultValue: 'other',
        comment: 'Motivo de la penalización'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
        validate: {
            min: {
                args: [0],
                msg: 'El monto no puede ser negativo'
            }
        },
        comment: 'Monto de la multa aplicada'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'paid'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Estado actual de la penalización'
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de expiración de la penalización'
    }
}, {
    tableName: 'penalties',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['expiresAt']
        }
    ],
    comment: 'Tabla de penalizaciones por cancelaciones tardías o no-show'
});

// Asociación con User
Penalty.belongsTo(User, {
    foreignKey: 'userId'
});

User.hasMany(Penalty, {
    foreignKey: 'userId'
});

module.exports = Penalty;
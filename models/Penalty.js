const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Penalty = sequelize.define('Penalty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Appointments',
            key: 'id'
        }
    },
    reason: {
        type: DataTypes.ENUM('no_show', 'late_cancellation'),
        allowNull: false
    },
    percentage: {
        type: DataTypes.FLOAT,
        defaultValue: 20.0
    },
    status: {
        type: DataTypes.ENUM('active', 'paid', 'waived'),
        defaultValue: 'active'
    }
});

module.exports = Penalty;
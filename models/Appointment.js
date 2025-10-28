const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    folio: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    dentistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 60
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show'),
        defaultValue: 'scheduled'
    },
    type: {
        type: DataTypes.ENUM('first_visit', 'follow_up', 'emergency'),
        defaultValue: 'first_visit'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Appointment;
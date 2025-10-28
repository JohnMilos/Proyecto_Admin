const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
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
    dentistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Appointments',
            key: 'id'
        }
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    treatment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observations: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    prescriptions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    xrayImages: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = MedicalRecord;
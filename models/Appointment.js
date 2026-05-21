const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la cita'
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        comment: 'ID del usuario paciente'
    },
    dentistId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        comment: 'ID del usuario dentista'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Fecha y hora programada de la cita'
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Estado actual de la cita'
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "Consulta dental",
        comment: 'Motivo de la consulta médica'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notas adicionales sobre la cita'
    }
}, {
    tableName: 'appointments',
    timestamps: true
});

// Asociaciones - CAMBIA doctor por dentist
Appointment.belongsTo(User, {
    as: 'patient',
    foreignKey: 'patientId'
});

Appointment.belongsTo(User, {
    as: 'dentist',  
    foreignKey: 'dentistId'  
});

User.hasMany(Appointment, {
    as: 'patientAppointments',
    foreignKey: 'patientId'
});

User.hasMany(Appointment, {
    as: 'dentistAppointments',  
    foreignKey: 'dentistId'  
});

module.exports = Appointment;
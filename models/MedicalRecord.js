const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

/**
 * Modelo de Expediente Médico
 *
 * Almacena la información médica de los pacientes
 * Puede estar relacionado con citas específicas
 */
const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del expediente médico'
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        comment: 'ID del paciente dueño del expediente'
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El diagnóstico no puede estar vacío'
            }
        },
        comment: 'Diagnóstico médico del paciente'
    },
    treatment: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Tratamiento prescrito al paciente'
    },
    prescriptions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Medicamentos recetados al paciente'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notas médicas adicionales'
    }
}, {
    tableName: 'medical_records',
    timestamps: true,
    indexes: [
        {
            fields: ['patientId']
        }
    ],
    comment: 'Tabla de expedientes médicos de los pacientes'
});

// Asociación con User
MedicalRecord.belongsTo(User, {
    as: 'patient',
    foreignKey: 'patientId'
});

User.hasMany(MedicalRecord, {
    as: 'medicalRecords',
    foreignKey: 'patientId'
});

module.exports = MedicalRecord;
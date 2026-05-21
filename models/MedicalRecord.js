const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

/**
 * Modelo de Expediente Médico
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
    comment: 'Tabla de expedientes médicos de los pacientes'
});

// ASOCIACIONES SIMPLIFICADAS
MedicalRecord.belongsTo(User, {
    foreignKey: 'patientId'
});

User.hasMany(MedicalRecord, {
    foreignKey: 'patientId'
});

// VERIFICAR QUE TENGA module.exports
module.exports = MedicalRecord;
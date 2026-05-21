const { DataTypes } = require('sequelize');

let MedicalRecordModel = null;

function initialize(sequelize) {
    MedicalRecordModel = sequelize.define('MedicalRecord', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        treatment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        prescriptions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'medical_records',
        timestamps: true,
    });

    return MedicalRecordModel;
}

function getModel() {
    if (!MedicalRecordModel) {
        throw new Error('MedicalRecordModel not initialized. Call initialize() first.');
    }
    return MedicalRecordModel;
}

module.exports = {
    initialize,
    getModel,
};
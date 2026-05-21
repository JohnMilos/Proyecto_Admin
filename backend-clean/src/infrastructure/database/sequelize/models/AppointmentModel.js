const { DataTypes } = require('sequelize');

let AppointmentModel = null;

function initialize(sequelize) {
    AppointmentModel = sequelize.define('Appointment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        folio: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dentistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled'),
            allowNull: false,
            defaultValue: 'scheduled',
        },
        type: {
            type: DataTypes.ENUM('first_visit', 'follow_up', 'emergency', 'cleaning', 'treatment'),
            allowNull: false,
            defaultValue: 'first_visit',
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Consulta dental',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'appointments',
        timestamps: true,
    });

    return AppointmentModel;
}

function getModel() {
    if (!AppointmentModel) {
        throw new Error('AppointmentModel not initialized. Call initialize() first.');
    }
    return AppointmentModel;
}

module.exports = {
    initialize,
    getModel,
};
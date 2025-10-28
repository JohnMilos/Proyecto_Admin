const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./User.js');

const Cita = sequelize.define('Cita', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    folio: {
        type: DataTypes.STRING,
        unique: true,
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('solicitada', 'confirmada', 'cancelada', 'terminada', 'penalizada'),
        defaultValue: 'solicitada',
    },
    pacienteId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id',
        },
    },
    profesionalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id',
        },
    },
});

// Relaciones
Usuario.hasMany(Cita, { foreignKey: 'pacienteId', as: 'citasPaciente' });
Usuario.hasMany(Cita, { foreignKey: 'profesionalId', as: 'citasProfesional' });
Cita.belongsTo(Usuario, { foreignKey: 'pacienteId', as: 'paciente' });
Cita.belongsTo(Usuario, { foreignKey: 'profesionalId', as: 'profesional' });

module.exports = Cita;
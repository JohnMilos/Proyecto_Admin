const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./User.js');

const Expediente = sequelize.define('Expediente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pacienteId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id',
        },
        unique: true, // Asumimos que un paciente tiene un expediente
    },
    observaciones: {
        type: DataTypes.TEXT,
    },
    // Podemos agregar más campos según lo necesario
});

Usuario.hasOne(Expediente, { foreignKey: 'pacienteId' });
Expediente.belongsTo(Usuario, { foreignKey: 'pacienteId' });

module.exports = Expediente;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./User.js');

const EspacioDisponible = sequelize.define('EspacioDisponible', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    profesionalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id',
        },
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('disponible', 'ocupado', 'cancelado'),
        defaultValue: 'disponible',
    },
});

Usuario.hasMany(EspacioDisponible, { foreignKey: 'profesionalId' });
EspacioDisponible.belongsTo(Usuario, { foreignKey: 'profesionalId' });

module.exports = EspacioDisponible;
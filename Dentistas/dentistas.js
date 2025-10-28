// models/Profesional.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profesional = sequelize.define('Profesional', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
            msg: 'Cada profesional debe estar asociado a un usuario único'
        },
        validate: {
            notNull: {
                msg: 'El usuario_id es obligatorio'
            },
            isInt: {
                msg: 'El usuario_id debe ser un número entero'
            }
        }
    },
    especialidad_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'El especialidad_id debe ser un número entero'
            }
        }
    },
    cedula: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'La cédula ya está registrada para otro profesional'
        },
        validate: {
            notEmpty: {
                msg: 'La cédula profesional es requerida'
            },
            len: {
                args: [5, 50],
                msg: 'La cédula debe tener entre 5 y 50 caracteres'
            }
        }
    }
}, {
    tableName: 'profesionales',
    timestamps: true
});

// Relaciones (asociaciones)
Profesional.associate = (models) => {
    // Un profesional pertenece a un usuario
    Profesional.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE'
    });

    // Un profesional pertenece a una especialidad
    Profesional.belongsTo(models.Especialidad, {
        foreignKey: 'especialidad_id',
        as: 'especialidad'
    });

    // Un profesional puede tener muchos espacios
    Profesional.hasMany(models.Espacio, {
        foreignKey: 'profesional_id',
        as: 'espacios',
        onDelete: 'CASCADE'
    });

    // Un profesional puede tener muchas citas
    Profesional.hasMany(models.Cita, {
        foreignKey: 'profesional_id',
        as: 'citas'
    });
};

module.exports = Profesional;

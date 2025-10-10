const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Ruta corregida xd
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
            len: {
                args: [6, 25],
                msg: 'El nombre debe tener entre 6 y 25 caracteres'
            },
            notEmpty: {
                msg: 'El nombre es requerido'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Este email ya está registrado'
        },
        validate: {
            isEmail: {
                msg: 'Por favor ingrese un email válido'
            },
            notEmpty: {
                msg: 'El email es requerido'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            len: {
                args: [10, 10],
                msg: 'El teléfono debe tener 10 dígitos'
            },
            isNumeric: {
                msg: 'El teléfono solo debe contener números'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 100],
                msg: 'La contraseña debe tener al menos 8 caracteres'
            }
        }
    },
    rol: {
        type: DataTypes.ENUM('paciente', 'dentista', 'administrador'),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

// Método para comparar contraseñas
Usuario.prototype.compararPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = Usuario;
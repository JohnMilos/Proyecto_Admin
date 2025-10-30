const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs'); // ← NECESITAS INSTALAR bcryptjs

/**
 * Modelo de Usuario
 */
const User = sequelize.define('User', {
    // ... tus campos actuales (id, name, email, password, role, phone)
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('patient', 'dentist', 'admin'),
        allowNull: false,
        defaultValue: 'patient'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // SIEMPRE DEBE ESTAR EN TRUE
        comment: 'Indica si la cuenta está activa'
    }
}, {
    tableName: 'users',
    timestamps: true
});

/**
 * HOOKS - Se ejecutan antes de crear/actualizar
 */

// Hash password antes de crear usuario
User.beforeCreate(async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Hash password antes de actualizar si cambió
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

/**
 * MÉTODOS DE INSTANCIA
 */

// Metodo para comparar las copntraseñas
User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Metodo para obtener los datos publicos del usuariop
User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;
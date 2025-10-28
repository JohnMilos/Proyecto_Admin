const sequelize = require('../config/database');
const User = require('../models/User');

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Base de datos inicializada');

        // Crear usuario administrador por defecto
        await User.create({
            name: 'Administrador Principal',
            email: 'admin@dental.com',
            phone: '1234567890',
            password: 'Admin123!',
            role: 'admin'
        });

        console.log('Usuario administrador creado: admin@dental.com / Admin123!');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

initializeDatabase();
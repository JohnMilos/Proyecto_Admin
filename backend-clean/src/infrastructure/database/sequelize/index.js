const { Sequelize } = require('sequelize');

let sequelize = null;

function getSequelize() {
    if (!sequelize) {
        sequelize = new Sequelize(
            process.env.DB_NAME || 'dental_admin',
            process.env.DB_USER || 'root',
            process.env.DB_PASSWORD || '',
            {
                host: process.env.DB_HOST || 'localhost',
                dialect: 'mysql',
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
                timezone: '-06:00',
            }
        );
    }
    return sequelize;
}

async function initializeDatabase() {
    const sequelize = getSequelize();
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

async function closeDatabase() {
    if (sequelize) {
        await sequelize.close();
        console.log('Database connection closed');
    }
}

module.exports = {
    getSequelize,
    initializeDatabase,
    closeDatabase,
};
const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuracion y conexion a la base de datos MySQL
 *
 * Este archivo establece la conexion con la base de datos usando Sequelize ORM
 * Soporta diferentes ambientes (development, production) mediante variables de entorno
 *
 * Importante: Exporta la instancia de Sequelize directamente para que los modelos
 * puedan usar sequelize.define() correctamente
 */
const sequelize = new Sequelize(
    // Nombre de la base de datos
    process.env.DB_NAME || 'dental_admin',

    // Usuario de la base de datos
    process.env.DB_USER || 'root',

    // Contraseña de la base de datos
    process.env.DB_PASSWORD || '',

    {
        // Host de la base de datos
        host: process.env.DB_HOST || 'localhost',

        // Dialecto de la base de datos (MySQL)
        dialect: 'mysql',

        // Pool de conexiones - configuracion para manejar multiples conexiones
        pool: {
            max: 10,        // Maximo de conexiones en el pool
            min: 0,         // Minimo de conexiones en el pool
            acquire: 30000, // Tiempo maximo en ms para adquirir conexion
            idle: 10000     // Tiempo maximo en ms que una conexion puede estar inactiva
        },

        // Configuracion de logging
        // En produccion se desactiva, en desarrollo se muestran queries
        logging: process.env.NODE_ENV === 'development' ? console.log : false,

        // Configuracion de dialecto especifica para MySQL
        dialectOptions: {
            // Timeout de conexion en ms
            connectTimeout: 60000,

            // Soporte para aplicaciones serverless (opcional)
            ...(process.env.DB_SSL === 'true' && {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            })
        },

        // Configuracion de timezone
        timezone: '-06:00', // Zona horaria de Mexico Central

        // Configuracion de reintentos de conexion
        retry: {
            max: 3, // Numero maximo de reintentos
        }
    }
);

/**
 * Funcion para probar la conexion a la base de datos
 * Se usa al iniciar la aplicacion para verificar que la BD este disponible
 *
 * @returns {Promise<boolean>} True si la conexion es exitosa
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion a la base de datos establecida correctamente.');
        return true;
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error.message);
        return false;
    }
};

/**
 * Funcion para sincronizar los modelos con la base de datos
 * Crea las tablas si no existen (solo en desarrollo)
 * En produccion se deben usar migraciones
 *
 * Nota: Los modelos deben ser importados antes de llamar a esta funcion
 * para que Sequelize los registre correctamente
 *
 * @param {boolean} force - Si es true, recrea las tablas (PELIGROSO en produccion)
 * @returns {Promise<boolean>} True si la sincronizacion fue exitosa
 */
const syncDatabase = async (force = false) => {
    try {
        // Solo forzar en desarrollo, nunca en produccion
        const shouldForce = force && process.env.NODE_ENV === 'development';

        if (shouldForce) {
            console.log('RECREANDO todas las tablas (modo desarrollo)...');
        }

        await sequelize.sync({ force: shouldForce });
        console.log('Modelos sincronizados con la base de datos.');
        return true;
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
        return false;
    }
};

/**
 * Funcion para cerrar la conexion a la base de datos
 * Util para graceful shutdown
 *
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
    try {
        await sequelize.close();
        console.log('Conexion a la base de datos cerrada.');
    } catch (error) {
        console.error('Error al cerrar la conexion a la base de datos:', error);
    }
};

/**
 * Exportaciones:
 * - sequelize: Instancia directa de Sequelize para uso en modelos
 * - testConnection: Funcion para probar conexion
 * - syncDatabase: Funcion para sincronizar modelos
 * - closeConnection: Funcion para cerrar conexion
 *
 * Los modelos deben importar sequelize asi:
 * const sequelize = require('../config/database').sequelize;
 * O usando destructuring:
 * const { sequelize } = require('../config/database');
 */
module.exports = {
    sequelize,        // Instancia directa de Sequelize
    testConnection,   // Funcion para probar conexion
    syncDatabase,     // Funcion para sincronizar BD
    closeConnection   // Funcion para cerrar conexion
};
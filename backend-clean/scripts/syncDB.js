require('dotenv').config();

const { getSequelize, initializeDatabase } = require('../src/infrastructure/database/sequelize');
const { syncDatabase } = require('../src/infrastructure/database/sequelize/sync');

/**
 * Script independiente para sincronizar la base de datos
 * Se ejecuta con: node scripts/syncDB.js
 * Para forzar recreación: node scripts/syncDB.js --force
 */

const runSync = async () => {
    try {
        console.log('🔄 Iniciando sincronización de la base de datos...');

        // 1. Conectar a la base de datos
        await initializeDatabase();
        console.log('✅ Conexión a la base de datos establecida');

        // 2. Verificar si se debe forzar
        const forceSync = process.argv.includes('--force') || process.argv.includes('-f');

        if (forceSync && process.env.NODE_ENV === 'production') {
            console.error('❌ NO se puede usar --force en producción');
            process.exit(1);
        }

        // 3. Sincronizar modelos
        await syncDatabase(forceSync);

        console.log('✅ Sincronización completada exitosamente');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error durante la sincronización:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    runSync();
}

module.exports = runSync;
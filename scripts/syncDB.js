const { testConnection, syncDatabase } = require('../config/database');

// ✅ IMPORTAR TODOS LOS MODELOS (ESENCIAL)
require('../models/User');
require('../models/Appointment');
require('../models/MedicalRecord');
require('../models/Penalty');

/**
 * Script independiente para sincronizar la base de datos
 * Se puede ejecutar con: node scripts/syncDB.js
 */

const runSync = async () => {
    try {
        console.log('Iniciando sincronización de la base de datos...');

        // 1. Probar conexión
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('No se pudo conectar a la base de datos');
            process.exit(1);
        }

        // 2. Sincronizar modelos
        // force: true → RECREA todas las tablas (solo desarrollo)
        // force: false → Crea solo las tablas que no existen
        const forceSync = process.argv.includes('--force') || process.argv.includes('-f');

        if (forceSync && process.env.NODE_ENV === 'production') {
            console.error('NO se puede usar --force en producción');
            process.exit(1);
        }

        await syncDatabase(forceSync);

        console.log('Sincronización completada exitosamente');
        process.exit(0);

    } catch (error) {
        console.error('Error durante la sincronización:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    runSync();
}

module.exports = runSync;
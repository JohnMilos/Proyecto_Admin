const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection, syncDatabase } = require('./config/database');

// Importar todos los modelos
require('./models/User');
require('./models/Appointment');
require('./models/MedicalRecord');
require('./models/Penalty');

const app = express();
const port = process.env.PORT || 3001;

/**
 * CONFIGURACIÓN DE MIDDLEWARES
 */
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * RUTA DE HEALTH CHECK
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API del Administrador Dental funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});

/**
 * IMPORTACIÓN Y CONFIGURACIÓN DE RUTAS
 */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medical-records', require('./routes/medicalRecords'));

/**
 * MANEJO DE RUTAS NO ENCONTRADAS (404) - VERSIÓN SIMPLE
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

/**
 * INICIALIZACIÓN DEL SERVIDOR
 */
const startServer = async () => {
    try {
        console.log('Iniciando Administrador Dental API...');
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);

        // 1. Probar conexión a la base de datos
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('No se pudo conectar a la base de datos');
        }

        // 2. Sincronizar modelos (solo en desarrollo)
        if (process.env.NODE_ENV !== 'production') {
            await syncDatabase(false);
            console.log('Modo desarrollo: Modelos sincronizados');
        }

        // 3. Iniciar servidor Express
        app.listen(port, '0.0.0.0', () => {
            console.log(`Servidor corriendo exitosamente en puerto ${port}`);
            console.log(`Health Check: http://localhost:${port}/health`);

            // Solo mostrar en desarrollo
            if (process.env.NODE_ENV !== 'production') {
                console.log(`API Auth: http://localhost:${port}/api/auth`);
                console.log(`API Appointments: http://localhost:${port}/api/appointments`);
            }
        });

    } catch (error) {
        console.error('Error crítico al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();

module.exports = app;
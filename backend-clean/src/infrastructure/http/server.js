const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordRoutes = require('./routes/medicalRecords');

function createServer(container) {
    const app = express();

    // Middlewares
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Health check
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'API funcionando correctamente',
            timestamp: new Date().toISOString(),
        });
    });

    // Routes
    app.use('/api/auth', authRoutes(container));
    app.use('/api/appointments', appointmentRoutes(container));
    app.use('/api/medical-records', medicalRecordRoutes(container));

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Ruta no encontrada',
        });
    });

    return app;
}

module.exports = { createServer };
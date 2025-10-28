const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
// Agregar más rutas según sea necesario

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor del Administrador Dental funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// Inicializar base de datos
const sequelize = require('./config/database');

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos (en producción usar migraciones)
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(port, () => {
            console.log(`Servidor corriendo exitosamente en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
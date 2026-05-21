require('dotenv').config();
const { initializeDatabase } = require('./src/infrastructure/database/sequelize');
const { createServer } = require('./src/infrastructure/http/server');
const container = require('./src/shared/di/container');

async function start() {
    try {
        // Inicializar base de datos
        await initializeDatabase();
        console.log(' Database connected');

        // Crear servidor
        const app = createServer(container);
        const port = process.env.PORT || 3001;

        // Iniciar servidor
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(` Health check: http://localhost:${port}/health`);
        });
    } catch (error) {
        console.error(' Failed to start server:', error);
        process.exit(1);
    }
}

start();
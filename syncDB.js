const sequelize = require('./config/database');
const Usuario = require('./models/User.js');
const Cita = require('./models/Cita');
const Expediente = require('./models/Expediente');
const Penalizacion = require('./models/Penalty.js');
const EspacioDisponible = require('./models/EspacioDisponible');

const sincronizarDB = async () => {
    try {
        await sequelize.sync({ force: false }); // Usar { force: true } solo en desarrollo para recrear las tablas
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

sincronizarDB();
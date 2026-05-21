const { getSequelize } = require('./index');
const UserModel = require('./models/UserModel');
const AppointmentModel = require('./models/AppointmentModel');
const MedicalRecordModel = require('./models/MedicalRecordModel');
const PenaltyModel = require('./models/PenaltyModel');

async function syncDatabase(force = false) {
    const sequelize = getSequelize();

    // Registrar modelos
    UserModel.initialize(sequelize);
    AppointmentModel.initialize(sequelize);
    MedicalRecordModel.initialize(sequelize);
    PenaltyModel.initialize(sequelize);

    // Establecer asociaciones
    const User = UserModel.getModel();
    const Appointment = AppointmentModel.getModel();
    const MedicalRecord = MedicalRecordModel.getModel();
    const Penalty = PenaltyModel.getModel();

    // Asociaciones
    User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
    User.hasMany(Appointment, { as: 'dentistAppointments', foreignKey: 'dentistId' });
    User.hasMany(MedicalRecord, { foreignKey: 'patientId' });
    User.hasMany(Penalty, { foreignKey: 'userId' });

    Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
    Appointment.belongsTo(User, { as: 'dentist', foreignKey: 'dentistId' });
    MedicalRecord.belongsTo(User, { foreignKey: 'patientId' });
    Penalty.belongsTo(User, { foreignKey: 'userId' });

    // Sincronizar
    const shouldForce = force && process.env.NODE_ENV !== 'production';
    await sequelize.sync({ force: shouldForce });
    console.log('Database synchronized successfully');
}

module.exports = { syncDatabase };
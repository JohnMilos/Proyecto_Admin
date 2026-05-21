// Repositories
const UserRepository = require('../../infrastructure/database/repositories/UserRepository');
const AppointmentRepository = require('../../infrastructure/database/repositories/AppointmentRepository');
const MedicalRecordRepository = require('../../infrastructure/database/repositories/MedicalRecordRepository');
const PenaltyRepository = require('../../infrastructure/database/repositories/PenaltyRepository');

// Use Cases - Auth
const RegisterUseCase = require('../../domain/use-cases/auth/RegisterUseCase');
const LoginUseCase = require('../../domain/use-cases/auth/LoginUseCase');
const GetProfileUseCase = require('../../domain/use-cases/auth/GetProfileUseCase');

// Use Cases - Appointments
const CreateAppointmentUseCase = require('../../domain/use-cases/appointments/CreateAppointmentUseCase');
const CancelAppointmentUseCase = require('../../domain/use-cases/appointments/CancelAppointmentUseCase');
const RescheduleAppointmentUseCase = require('../../domain/use-cases/appointments/RescheduleAppointmentUseCase');
const GetAppointmentsUseCase = require('../../domain/use-cases/appointments/GetAppointmentsUseCase');
const GetOccupiedSlotsUseCase = require('../../domain/use-cases/appointments/GetOccupiedSlotsUseCase');
const CompleteAppointmentUseCase = require('../../domain/use-cases/appointments/CompleteAppointmentUseCase');

// Use Cases - Medical
const CreateMedicalRecordUseCase = require('../../domain/use-cases/medical/CreateMedicalRecordUseCase');
const GetMedicalRecordUseCase = require('../../domain/use-cases/medical/GetMedicalRecordUseCase');
const UpdateMedicalRecordUseCase = require('../../domain/use-cases/medical/UpdateMedicalRecordUseCase');

// Controllers
const AuthController = require('../../infrastructure/http/controllers/AuthController');
const AppointmentController = require('../../infrastructure/http/controllers/AppointmentController');
const MedicalRecordController = require('../../infrastructure/http/controllers/MedicalRecordController');

// Services
const JWTService = require('../../infrastructure/services/token/JWTService');

// Utils
const generateFolio = require('../utils/generateFolio');

class Container {
    constructor() {
        this.dependencies = new Map();
        this.setup();
    }

    setup() {
        // Repositories
        const userRepository = new UserRepository();
        const appointmentRepository = new AppointmentRepository();
        const medicalRecordRepository = new MedicalRecordRepository();
        const penaltyRepository = new PenaltyRepository();

        // Services
        const jwtService = new JWTService();
        const tokenGenerator = (userId) => jwtService.generate(userId);

        // Use Cases - Auth
        const registerUseCase = new RegisterUseCase(userRepository, tokenGenerator);
        const loginUseCase = new LoginUseCase(userRepository, tokenGenerator);
        const getProfileUseCase = new GetProfileUseCase(userRepository);

        // Use Cases - Appointments
        const createAppointmentUseCase = new CreateAppointmentUseCase(
            appointmentRepository, userRepository, penaltyRepository, generateFolio
        );
        const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository, penaltyRepository, userRepository);
        const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(appointmentRepository, userRepository);
        const getAppointmentsUseCase = new GetAppointmentsUseCase(appointmentRepository);
        const getOccupiedSlotsUseCase = new GetOccupiedSlotsUseCase(appointmentRepository, userRepository);
        const completeAppointmentUseCase = new CompleteAppointmentUseCase(appointmentRepository);

        // Use Cases - Medical
        const createMedicalRecordUseCase = new CreateMedicalRecordUseCase(medicalRecordRepository, userRepository);
        const getMedicalRecordUseCase = new GetMedicalRecordUseCase(medicalRecordRepository, userRepository);
        const updateMedicalRecordUseCase = new UpdateMedicalRecordUseCase(medicalRecordRepository);

        // Controllers
        const authController = new AuthController(registerUseCase, loginUseCase, getProfileUseCase);
        const appointmentController = new AppointmentController(
            createAppointmentUseCase,
            cancelAppointmentUseCase,
            rescheduleAppointmentUseCase,
            getAppointmentsUseCase,
            getOccupiedSlotsUseCase,
            completeAppointmentUseCase
        );
        const medicalRecordController = new MedicalRecordController(
            createMedicalRecordUseCase,
            getMedicalRecordUseCase,
            updateMedicalRecordUseCase
        );

        // Registrar en el contenedor
        this.dependencies.set('AuthController', authController);
        this.dependencies.set('AppointmentController', appointmentController);
        this.dependencies.set('MedicalRecordController', medicalRecordController);
        this.dependencies.set('UserRepository', userRepository);
    }

    get(name) {
        if (!this.dependencies.has(name)) {
            throw new Error(`Dependency ${name} not found`);
        }
        return this.dependencies.get(name);
    }
}

module.exports = new Container();
class CreateMedicalRecordUseCase {
    constructor(medicalRecordRepository, userRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { patientId, diagnosis, treatment, prescriptions, notes, userId, userRole } = request;

        // 1. Verificar permisos
        if (userRole !== 'dentist' && userRole !== 'admin') {
            throw new Error('No tiene permisos para crear expedientes médicos');
        }

        // 2. Verificar que el paciente existe
        const patient = await this.userRepository.findById(patientId);
        if (!patient) {
            throw new Error('Paciente no encontrado');
        }

        // 3. Crear expediente
        const MedicalRecord = require('../../entities/MedicalRecord');
        const record = MedicalRecord.create({
            patientId,
            diagnosis,
            treatment,
            prescriptions,
            notes,
        });

        // 4. Guardar
        const savedRecord = await this.medicalRecordRepository.save(record);

        return {
            medicalRecord: savedRecord.toJSON(),
        };
    }
}

module.exports = CreateMedicalRecordUseCase;
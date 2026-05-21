class GetMedicalRecordUseCase {
    constructor(medicalRecordRepository, userRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { recordId, patientId, userId, userRole } = request;

        let records;

        if (recordId) {
            // Obtener un expediente específico
            const record = await this.medicalRecordRepository.findById(recordId);
            if (!record) {
                throw new Error('Expediente médico no encontrado');
            }

            // Verificar permisos
            if (userRole === 'patient' && record.patientId !== userId) {
                throw new Error('No tiene permisos para ver este expediente');
            }

            records = [record];
        } else if (patientId) {
            // Obtener todos los expedientes de un paciente
            if (userRole === 'patient' && parseInt(patientId) !== userId) {
                throw new Error('No tiene permisos para ver estos expedientes');
            }
            records = await this.medicalRecordRepository.findByPatientId(patientId);
        } else {
            throw new Error('Se requiere recordId o patientId');
        }

        return {
            medicalRecords: records.map(r => r.toJSON()),
        };
    }
}

module.exports = GetMedicalRecordUseCase;
class UpdateMedicalRecordUseCase {
    constructor(medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    async execute(request) {
        const { recordId, diagnosis, treatment, prescriptions, notes, userRole } = request;

        // 1. Verificar permisos
        if (userRole !== 'dentist' && userRole !== 'admin') {
            throw new Error('No tiene permisos para actualizar expedientes médicos');
        }

        // 2. Obtener el expediente
        const record = await this.medicalRecordRepository.findById(recordId);
        if (!record) {
            throw new Error('Expediente médico no encontrado');
        }

        // 3. Actualizar
        record.update({ diagnosis, treatment, prescriptions, notes });
        const updated = await this.medicalRecordRepository.update(record);

        return {
            medicalRecord: updated.toJSON(),
        };
    }
}

module.exports = UpdateMedicalRecordUseCase;
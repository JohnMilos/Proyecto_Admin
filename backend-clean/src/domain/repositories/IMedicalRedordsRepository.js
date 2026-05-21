/**
 * Interface for Medical Record Repository
 * @interface IMedicalRecordRepository
 */
class IMedicalRecordRepository {
    async save(record) { throw new Error('Method not implemented'); }
    async findById(id) { throw new Error('Method not implemented'); }
    async findByPatientId(patientId) { throw new Error('Method not implemented'); }
    async update(record) { throw new Error('Method not implemented'); }
    async delete(id) { throw new Error('Method not implemented'); }
}

module.exports = IMedicalRecordRepository;
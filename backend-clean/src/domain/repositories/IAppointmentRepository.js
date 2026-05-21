/**
 * Interface for Appointment Repository
 * @interface IAppointmentRepository
 */
class IAppointmentRepository {
    async save(appointment) { throw new Error('Method not implemented'); }
    async findById(id) { throw new Error('Method not implemented'); }
    async findByFolio(folio) { throw new Error('Method not implemented'); }
    async findByPatientId(patientId, filters) { throw new Error('Method not implemented'); }
    async findByDentistId(dentistId, filters) { throw new Error('Method not implemented'); }
    async findAll(filters) { throw new Error('Method not implemented'); }
    async findOverlappingAppointment(dentistId, date, excludeId) { throw new Error('Method not implemented'); }
    async update(appointment) { throw new Error('Method not implemented'); }
    async delete(id) { throw new Error('Method not implemented'); }
    async count(filters) { throw new Error('Method not implemented'); }
    async findWithPagination(filters, page, limit) { throw new Error('Method not implemented'); }
}

module.exports = IAppointmentRepository;
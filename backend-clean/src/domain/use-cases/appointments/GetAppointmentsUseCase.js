class GetAppointmentsUseCase {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    async execute(request) {
        const { userId, userRole, status, dentistId, startDate, endDate, page, limit } = request;

        // Construir filtros según el rol
        const filters = {};

        if (userRole === 'patient') {
            filters.patientId = userId;
        } else if (userRole === 'dentist') {
            filters.dentistId = userId;
        }

        if (status) filters.status = status;
        if (dentistId) filters.dentistId = dentistId;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        // Obtener citas con paginación
        const result = await this.appointmentRepository.findWithPagination(filters, page, limit);

        return {
            appointments: result.rows.map(a => a.toJSON()),
            total: result.count,
            page,
            totalPages: Math.ceil(result.count / limit),
        };
    }
}

module.exports = GetAppointmentsUseCase;
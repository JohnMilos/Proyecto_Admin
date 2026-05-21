class GetOccupiedSlotsUseCase {
    constructor(appointmentRepository, userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { startDate, endDate, dentistId } = request;

        const filters = {
            status: ['scheduled', 'confirmed'],
        };

        if (dentistId) filters.dentistId = dentistId;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const appointments = await this.appointmentRepository.findAll(filters);

        // Enriquecer con datos del dentista
        const occupiedSlots = [];
        for (const appointment of appointments) {
            const dentist = await this.userRepository.findById(appointment.dentistId);
            occupiedSlots.push({
                appointmentId: appointment.id,
                dentistId: appointment.dentistId,
                dentistName: dentist?.name || 'Unknown',
                dentistSpecialty: dentist?.specialty || 'General',
                date: appointment.date,
                status: appointment.status,
                available: false,
            });
        }

        return {
            occupiedSlots,
            total: occupiedSlots.length,
        };
    }
}

module.exports = GetOccupiedSlotsUseCase;
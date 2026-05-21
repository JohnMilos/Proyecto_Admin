class CompleteAppointmentUseCase {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    async execute(request) {
        const { appointmentId, userId, userRole, notes } = request;

        // 1. Obtener la cita
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Cita no encontrada');
        }

        // 2. Verificar permisos (solo dentista asignado o admin)
        if (userRole === 'dentist' && appointment.dentistId !== userId) {
            throw new Error('No tiene permisos para completar esta cita');
        }

        // 3. Verificar que la cita esté en estado scheduled
        if (appointment.status !== 'scheduled') {
            throw new Error(`No se puede completar una cita con estado: ${appointment.status}`);
        }

        // 4. Completar la cita
        appointment.complete();
        const updated = await this.appointmentRepository.update(appointment);

        return {
            appointment: updated.toJSON(),
        };
    }
}

module.exports = CompleteAppointmentUseCase;
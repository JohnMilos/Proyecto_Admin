class RescheduleAppointmentUseCase {
    constructor(appointmentRepository, userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { appointmentId, userId, newDate } = request;

        // 1. Obtener la cita
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Cita no encontrada');
        }

        // 2. Verificar que sea el paciente dueño
        if (appointment.patientId !== userId) {
            throw new Error('No tiene permisos para reagendar esta cita');
        }

        // 3. Verificar límite de 48 horas
        if (!appointment.canBeRescheduled()) {
            throw new Error('Solo se puede reagendar con al menos 48 horas de anticipación');
        }

        // 4. Verificar disponibilidad del dentista
        const overlapping = await this.appointmentRepository.findOverlappingAppointment(
            appointment.dentistId,
            newDate,
            appointmentId
        );
        if (overlapping) {
            throw new Error('El dentista no está disponible en el nuevo horario');
        }

        // 5. Reagendar
        appointment.reschedule(newDate);
        const updated = await this.appointmentRepository.update(appointment);

        return {
            appointment: updated.toJSON(),
        };
    }
}

module.exports = RescheduleAppointmentUseCase;
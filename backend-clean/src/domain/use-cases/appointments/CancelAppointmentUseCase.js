class CancelAppointmentUseCase {
    constructor(appointmentRepository, penaltyRepository, userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.penaltyRepository = penaltyRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { appointmentId, userId, userRole } = request;

        // 1. Obtener la cita
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Cita no encontrada');
        }

        // 2. Verificar permisos
        if (userRole === 'patient' && appointment.patientId !== userId) {
            throw new Error('No tiene permisos para cancelar esta cita');
        }

        // 3. Verificar si aplica penalización (solo para pacientes)
        let penaltyApplied = false;
        if (userRole === 'patient' && !appointment.canBeCancelled()) {
            const Penalty = require('../../entities/Penalty');
            const penalty = Penalty.create({
                userId: appointment.patientId,
                reason: 'late_cancellation',
                amount: 0, // 20% del costo de la cita
                expiresAt: null,
            });
            await this.penaltyRepository.save(penalty);
            penaltyApplied = true;
        }

        // 4. Cancelar la cita
        appointment.cancel();
        await this.appointmentRepository.update(appointment);

        return {
            message: penaltyApplied
                ? 'Cita cancelada. Se aplicó una penalización del 20% por cancelación tardía.'
                : 'Cita cancelada exitosamente',
            penaltyApplied,
        };
    }
}

module.exports = CancelAppointmentUseCase;
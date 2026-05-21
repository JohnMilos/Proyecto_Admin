class CreateAppointmentUseCase {
    constructor(appointmentRepository, userRepository, penaltyRepository, folioGenerator) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.penaltyRepository = penaltyRepository;
        this.folioGenerator = folioGenerator;
    }

    async execute(request) {
        const { patientId, dentistId, date, type, notes } = request;

        // 1. Verificar penalizaciones activas
        const activePenalty = await this.penaltyRepository.findActiveByUserId(patientId);
        if (activePenalty) {
            throw new Error('Tiene una penalización activa. Deberá pagar un cargo del 20% al finalizar la cita.');
        }

        // 2. Verificar que el dentista existe y está activo
        const dentist = await this.userRepository.findById(dentistId);
        if (!dentist || !dentist.isActive || !dentist.isDentist()) {
            throw new Error('El dentista no está disponible');
        }

        // 3. Verificar disponibilidad (1 hora de bloqueo)
        const overlapping = await this.appointmentRepository.findOverlappingAppointment(dentistId, date);
        if (overlapping) {
            throw new Error('El dentista no está disponible en ese horario');
        }

        // 4. Verificar que la cita sea en futuro
        if (date <= new Date()) {
            throw new Error('La cita debe ser programada para una fecha futura');
        }

        // 5. Crear la cita
        const Appointment = require('../../entities/Appointment');
        const folio = this.folioGenerator();
        const appointment = Appointment.create({
            folio,
            patientId,
            dentistId,
            date,
            type: type || 'first_visit',
            notes,
        });

        // 6. Guardar
        const savedAppointment = await this.appointmentRepository.save(appointment);

        return {
            appointment: savedAppointment.toJSON(),
        };
    }
}

module.exports = CreateAppointmentUseCase;
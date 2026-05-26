const Appointment = require('../../src/domain/entities/Appointment');

describe('Appointment Entity', () => {
    test('should create an appointment', () => {
        const apt = Appointment.create({
            folio: 'CITA-123',
            patientId: 1,
            dentistId: 2,
            date: new Date('2025-12-25T10:00:00'),
            type: 'first_visit'
        });

        expect(apt.status).toBe('scheduled');
        expect(apt.patientId).toBe(1);
    });

    test('should cancel appointment', () => {
        const apt = Appointment.create({ folio: 'CITA-456', patientId: 1, dentistId: 2, date: new Date('2025-12-25T10:00:00'), type: 'first_visit' });
        apt.cancel();
        expect(apt.status).toBe('cancelled');
    });
});
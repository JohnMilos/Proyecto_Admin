const MedicalRecord = require('../../src/domain/entities/MedicalRecord');

describe('MedicalRecord Entity', () => {
    test('should create a medical record', () => {
        const record = MedicalRecord.create({
            patientId: 1,
            diagnosis: 'Caries dental',
            treatment: 'Limpieza y empaste',
            prescriptions: 'Ibuprofeno 400mg',
            notes: 'Paciente con dolor'
        });

        expect(record.patientId).toBe(1);
        expect(record.diagnosis).toBe('Caries dental');
        expect(record.treatment).toBe('Limpieza y empaste');
    });

    test('should throw error if diagnosis is missing', () => {
        expect(() => {
            MedicalRecord.create({
                patientId: 1,
                diagnosis: '',
                treatment: 'Limpieza'
            });
        }).toThrow('El diagnóstico es requerido');
    });

    test('should update medical record', () => {
        const record = MedicalRecord.create({
            patientId: 1,
            diagnosis: 'Caries',
            treatment: 'Empaste'
        });

        record.update({
            diagnosis: 'Caries avanzada',
            treatment: 'Conducto'
        });

        expect(record.diagnosis).toBe('Caries avanzada');
        expect(record.treatment).toBe('Conducto');
    });
});
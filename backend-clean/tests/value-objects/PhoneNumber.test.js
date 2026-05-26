const PhoneNumber = require('../../src/domain/value-objects/PhoneNumber');

describe('PhoneNumber Value Object', () => {
    test('should create valid phone number', () => {
        const phone = new PhoneNumber('5512345678');
        expect(phone.value).toBe('5512345678');
    });

    test('should clean non-digit characters', () => {
        const phone = new PhoneNumber('(55) 1234-5678');
        expect(phone.value).toBe('5512345678');
    });

    test('should throw error for invalid phone (less than 10 digits)', () => {
        expect(() => new PhoneNumber('123')).toThrow('El número de teléfono debe tener al menos 10 dígitos');
        expect(() => new PhoneNumber('')).toThrow('El número de teléfono debe tener al menos 10 dígitos');
    });
});
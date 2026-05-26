const Password = require('../../src/domain/value-objects/Password');

describe('Password Value Object', () => {
    test('should create hashed password', () => {
        const password = new Password('Admin123!');
        expect(password.value).not.toBe('Admin123!');
        expect(password.value.length).toBeGreaterThan(20);
    });

    test('should validate correct password', () => {
        const password = new Password('Admin123!');
        expect(password.validate('Admin123!')).toBe(true);
        expect(password.validate('WrongPass123!')).toBe(false);
    });

    test('should throw error for weak password', () => {
        expect(() => new Password('weak')).toThrow();
        expect(() => new Password('nouppercase123!')).toThrow();
        expect(() => new Password('NOLOWERCASE123!')).toThrow();
        expect(() => new Password('NoNumber!')).toThrow();
        expect(() => new Password('NoSpecialChar123')).toThrow();
    });

    test('should accept pre-hashed password', () => {
        const hashed = '$2a$10$somehashedpassword';
        const password = new Password(hashed, true);
        expect(password.value).toBe(hashed);
    });
});
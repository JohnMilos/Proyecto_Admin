const Email = require('../../src/domain/value-objects/Email');

describe('Email Value Object', () => {
    test('should create valid email', () => {
        const email = new Email('test@example.com');
        expect(email.value).toBe('test@example.com');
    });

    test('should normalize email to lowercase', () => {
        const email = new Email('Test@Example.COM');
        expect(email.value).toBe('test@example.com');
    });

    test('should throw error for invalid email', () => {
        expect(() => new Email('invalid-email')).toThrow('Formato de email inválido');
        expect(() => new Email('test@')).toThrow('Formato de email inválido');
        expect(() => new Email('')).toThrow('Formato de email inválido');
    });

    test('should compare two emails', () => {
        const email1 = new Email('test@example.com');
        const email2 = new Email('test@example.com');
        const email3 = new Email('other@example.com');

        expect(email1.equals(email2)).toBe(true);
        expect(email1.equals(email3)).toBe(false);
    });
});
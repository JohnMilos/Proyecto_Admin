const User = require('../../src/domain/entities/User');
const Email = require('../../src/domain/value-objects/Email');
const Password = require('../../src/domain/value-objects/Password');

describe('User Entity', () => {
    test('should create a valid user', () => {
        const user = User.create({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            password: 'Admin123!',
            role: 'patient'
        });

        expect(user.name).toBe('John Doe');
        expect(user.email.value).toBe('john@example.com');
        expect(user.isActive).toBe(true);
        expect(user.role).toBe('patient');
    });

    test('should deactivate user', () => {
        const user = User.create({ name: 'Test', email: 'test@test.com', phone: '1234567890', password: 'Admin123!', role: 'patient' });
        user.deactivate();
        expect(user.isActive).toBe(false);
    });
});
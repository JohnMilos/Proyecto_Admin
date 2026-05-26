const Penalty = require('../../src/domain/entities/Penalty');

describe('Penalty Entity', () => {
    test('should create a penalty', () => {
        const penalty = Penalty.create({
            userId: 1,
            reason: 'late_cancellation',
            amount: 20.00,
            expiresAt: null
        });

        expect(penalty.userId).toBe(1);
        expect(penalty.reason).toBe('late_cancellation');
        expect(penalty.amount).toBe(20.00);
        expect(penalty.status).toBe('active');
    });

    test('should pay penalty', () => {
        const penalty = Penalty.create({
            userId: 1,
            reason: 'no_show',
            amount: 50.00,
            expiresAt: null
        });

        penalty.pay();
        expect(penalty.status).toBe('paid');
    });

    test('isActive should return true for active penalty', () => {
        const penalty = Penalty.create({
            userId: 1,
            reason: 'other',
            amount: 0,
            expiresAt: null
        });

        expect(penalty.isActive()).toBe(true);

        penalty.pay();
        expect(penalty.isActive()).toBe(false);
    });
});
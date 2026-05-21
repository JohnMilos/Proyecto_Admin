class Penalty {
    constructor(props) {
        this._id = props.id;
        this._userId = props.userId;
        this._reason = props.reason;
        this._amount = props.amount;
        this._status = props.status;
        this._expiresAt = props.expiresAt || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
    }

    static create({ userId, reason, amount, expiresAt }) {
        return new Penalty({
            userId,
            reason,
            amount,
            status: 'active',
            expiresAt,
        });
    }

    static restore(props) {
        return new Penalty(props);
    }

    // Getters
    get id() { return this._id; }
    get userId() { return this._userId; }
    get reason() { return this._reason; }
    get amount() { return this._amount; }
    get status() { return this._status; }
    get expiresAt() { return this._expiresAt; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    // Métodos de negocio
    pay() {
        this._status = 'paid';
        this._updatedAt = new Date();
    }

    isActive() {
        return this._status === 'active';
    }

    toJSON() {
        return {
            id: this._id,
            userId: this._userId,
            reason: this._reason,
            amount: this._amount,
            status: this._status,
            expiresAt: this._expiresAt,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}

module.exports = Penalty;
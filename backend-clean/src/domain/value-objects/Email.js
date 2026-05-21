class Email {
    constructor(email) {
        if (!this.isValid(email)) {
            throw new Error('Formato de email inválido');
        }
        this._value = email.toLowerCase().trim();
    }

    isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get value() {
        return this._value;
    }

    equals(other) {
        return this._value === other.value;
    }
}

module.exports = Email;
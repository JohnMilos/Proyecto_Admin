class PhoneNumber {
    constructor(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (!this.isValid(cleaned)) {
            throw new Error('El número de teléfono debe tener al menos 10 dígitos');
        }
        this._value = cleaned;
    }

    isValid(phone) {
        return phone.length >= 10;
    }

    get value() {
        return this._value;
    }
}

module.exports = PhoneNumber;
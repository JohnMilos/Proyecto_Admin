const bcrypt = require('bcryptjs');

class Password {
    constructor(password, hashed = false) {
        if (!hashed && !this.isValidPlainPassword(password)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
        }
        this._value = hashed ? password : this.hash(password);
        this._hashed = hashed;
    }

    isValidPlainPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    hash(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    validate(plainPassword) {
        return bcrypt.compareSync(plainPassword, this._value);
    }

    get value() {
        return this._value;
    }
}

module.exports = Password;
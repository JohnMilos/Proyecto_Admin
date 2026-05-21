const Email = require('../value-objects/Email');
const PhoneNumber = require('../value-objects/PhoneNumber');
const Password = require('../value-objects/Password');

class User {
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._email = props.email;
        this._phone = props.phone;
        this._password = props.password;
        this._role = props.role;
        this._specialty = props.specialty || null;
        this._isActive = props.isActive !== undefined ? props.isActive : true;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
    }

    static create({ name, email, phone, password, role, specialty }) {
        return new User({
            name,
            email: new Email(email),
            phone: new PhoneNumber(phone),
            password: new Password(password),
            role: role || 'patient',
            specialty: role === 'dentist' ? specialty : null,
        });
    }

    static restore(props) {
        return new User({
            id: props.id,
            name: props.name,
            email: props.email instanceof Email ? props.email : new Email(props.email),
            phone: props.phone instanceof PhoneNumber ? props.phone : new PhoneNumber(props.phone),
            password: props.password instanceof Password ? props.password : new Password(props.password, true),
            role: props.role,
            specialty: props.specialty,
            isActive: props.isActive,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }

    // Getters
    get id() { return this._id; }
    get name() { return this._name; }
    get email() { return this._email; }
    get phone() { return this._phone; }
    get password() { return this._password; }
    get role() { return this._role; }
    get specialty() { return this._specialty; }
    get isActive() { return this._isActive; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    // Métodos de negocio
    deactivate() {
        this._isActive = false;
        this._updatedAt = new Date();
    }

    activate() {
        this._isActive = true;
        this._updatedAt = new Date();
    }

    updateProfile(name, phone) {
        this._name = name;
        this._phone = new PhoneNumber(phone);
        this._updatedAt = new Date();
    }

    isPatient() { return this._role === 'patient'; }
    isDentist() { return this._role === 'dentist'; }
    isAdmin() { return this._role === 'admin'; }

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            email: this._email.value,
            phone: this._phone.value,
            role: this._role,
            specialty: this._specialty,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}

module.exports = User;
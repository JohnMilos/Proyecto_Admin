class Appointment {
    constructor(props) {
        this._id = props.id;
        this._folio = props.folio;
        this._patientId = props.patientId;
        this._dentistId = props.dentistId;
        this._date = props.date;
        this._status = props.status;
        this._type = props.type;
        this._reason = props.reason || 'Consulta dental';
        this._notes = props.notes || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
    }

    static create({ folio, patientId, dentistId, date, type, reason, notes }) {
        return new Appointment({
            folio,
            patientId,
            dentistId,
            date,
            status: 'scheduled',
            type: type || 'first_visit',
            reason,
            notes,
        });
    }

    static restore(props) {
        return new Appointment(props);
    }

    // Getters
    get id() { return this._id; }
    get folio() { return this._folio; }
    get patientId() { return this._patientId; }
    get dentistId() { return this._dentistId; }
    get date() { return this._date; }
    get status() { return this._status; }
    get type() { return this._type; }
    get reason() { return this._reason; }
    get notes() { return this._notes; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    // Métodos de negocio
    cancel() {
        if (this._status === 'completed') {
            throw new Error('No se puede cancelar una cita ya completada');
        }
        this._status = 'cancelled';
        this._updatedAt = new Date();
    }

    complete() {
        if (this._status !== 'scheduled') {
            throw new Error(`No se puede completar una cita con estado: ${this._status}`);
        }
        this._status = 'completed';
        this._updatedAt = new Date();
    }

    reschedule(newDate) {
        if (this._status === 'completed') {
            throw new Error('No se puede reagendar una cita completada');
        }
        this._date = newDate;
        this._status = 'rescheduled';
        this._updatedAt = new Date();
    }

    canBeCancelled() {
        const hoursUntil = (this._date.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        return hoursUntil >= 24;
    }

    canBeRescheduled() {
        const hoursUntil = (this._date.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        return hoursUntil >= 48;
    }

    toJSON() {
        return {
            id: this._id,
            folio: this._folio,
            patientId: this._patientId,
            dentistId: this._dentistId,
            date: this._date,
            status: this._status,
            type: this._type,
            reason: this._reason,
            notes: this._notes,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}

module.exports = Appointment;
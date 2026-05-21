class MedicalRecord {
    constructor(props) {
        this._id = props.id;
        this._patientId = props.patientId;
        this._diagnosis = props.diagnosis;
        this._treatment = props.treatment || null;
        this._prescriptions = props.prescriptions || null;
        this._notes = props.notes || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
    }

    static create({ patientId, diagnosis, treatment, prescriptions, notes }) {
        if (!diagnosis || diagnosis.trim().length === 0) {
            throw new Error('El diagnóstico es requerido');
        }
        return new MedicalRecord({
            patientId,
            diagnosis,
            treatment,
            prescriptions,
            notes,
        });
    }

    static restore(props) {
        return new MedicalRecord(props);
    }

    // Getters
    get id() { return this._id; }
    get patientId() { return this._patientId; }
    get diagnosis() { return this._diagnosis; }
    get treatment() { return this._treatment; }
    get prescriptions() { return this._prescriptions; }
    get notes() { return this._notes; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    // Métodos de negocio
    update({ diagnosis, treatment, prescriptions, notes }) {
        if (diagnosis) this._diagnosis = diagnosis;
        if (treatment !== undefined) this._treatment = treatment;
        if (prescriptions !== undefined) this._prescriptions = prescriptions;
        if (notes !== undefined) this._notes = notes;
        this._updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this._id,
            patientId: this._patientId,
            diagnosis: this._diagnosis,
            treatment: this._treatment,
            prescriptions: this._prescriptions,
            notes: this._notes,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}

module.exports = MedicalRecord;
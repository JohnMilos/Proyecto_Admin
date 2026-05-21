const MedicalRecordModel = require('../sequelize/models/MedicalRecordModel');
const MedicalRecord = require('../../../domain/entities/MedicalRecord');

class MedicalRecordRepository {
    async save(record) {
        const MedicalRecordModelClass = MedicalRecordModel.getModel();
        const data = {
            patientId: record.patientId,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            prescriptions: record.prescriptions,
            notes: record.notes,
        };

        const created = await MedicalRecordModelClass.create(data);

        return MedicalRecord.restore({
            id: created.id,
            patientId: created.patientId,
            diagnosis: created.diagnosis,
            treatment: created.treatment,
            prescriptions: created.prescriptions,
            notes: created.notes,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }

    async findById(id) {
        const MedicalRecordModelClass = MedicalRecordModel.getModel();
        const record = await MedicalRecordModelClass.findByPk(id);
        if (!record) return null;

        return MedicalRecord.restore({
            id: record.id,
            patientId: record.patientId,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            prescriptions: record.prescriptions,
            notes: record.notes,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }

    async findByPatientId(patientId) {
        const MedicalRecordModelClass = MedicalRecordModel.getModel();
        const records = await MedicalRecordModelClass.findAll({
            where: { patientId },
            order: [['createdAt', 'DESC']],
        });

        return records.map(r => MedicalRecord.restore({
            id: r.id,
            patientId: r.patientId,
            diagnosis: r.diagnosis,
            treatment: r.treatment,
            prescriptions: r.prescriptions,
            notes: r.notes,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }));
    }

    async update(record) {
        const MedicalRecordModelClass = MedicalRecordModel.getModel();
        await MedicalRecordModelClass.update(
            {
                diagnosis: record.diagnosis,
                treatment: record.treatment,
                prescriptions: record.prescriptions,
                notes: record.notes,
            },
            { where: { id: record.id } }
        );
        return record;
    }

    async delete(id) {
        const MedicalRecordModelClass = MedicalRecordModel.getModel();
        await MedicalRecordModelClass.destroy({ where: { id } });
    }
}

module.exports = MedicalRecordRepository;
const { Op } = require('sequelize');
const AppointmentModel = require('../sequelize/models/AppointmentModel');
const Appointment = require('../../../domain/entities/Appointment');

class AppointmentRepository {
    async save(appointment) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const data = {
            folio: appointment.folio,
            patientId: appointment.patientId,
            dentistId: appointment.dentistId,
            date: appointment.date,
            status: appointment.status,
            type: appointment.type,
            reason: appointment.reason,
            notes: appointment.notes,
        };

        const created = await AppointmentModelClass.create(data);

        return Appointment.restore({
            id: created.id,
            folio: created.folio,
            patientId: created.patientId,
            dentistId: created.dentistId,
            date: created.date,
            status: created.status,
            type: created.type,
            reason: created.reason,
            notes: created.notes,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }

    async findById(id) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const appointment = await AppointmentModelClass.findByPk(id);
        if (!appointment) return null;

        return Appointment.restore({
            id: appointment.id,
            folio: appointment.folio,
            patientId: appointment.patientId,
            dentistId: appointment.dentistId,
            date: appointment.date,
            status: appointment.status,
            type: appointment.type,
            reason: appointment.reason,
            notes: appointment.notes,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
        });
    }

    async findByFolio(folio) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const appointment = await AppointmentModelClass.findOne({ where: { folio } });
        if (!appointment) return null;

        return Appointment.restore({
            id: appointment.id,
            folio: appointment.folio,
            patientId: appointment.patientId,
            dentistId: appointment.dentistId,
            date: appointment.date,
            status: appointment.status,
            type: appointment.type,
            reason: appointment.reason,
            notes: appointment.notes,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
        });
    }

    async findByPatientId(patientId, filters = {}) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const where = { patientId };

        if (filters.status) where.status = filters.status;
        if (filters.startDate || filters.endDate) {
            where.date = {};
            if (filters.startDate) where.date[Op.gte] = filters.startDate;
            if (filters.endDate) where.date[Op.lte] = filters.endDate;
        }

        const appointments = await AppointmentModelClass.findAll({ where, order: [['date', 'DESC']] });

        return appointments.map(a => Appointment.restore({
            id: a.id,
            folio: a.folio,
            patientId: a.patientId,
            dentistId: a.dentistId,
            date: a.date,
            status: a.status,
            type: a.type,
            reason: a.reason,
            notes: a.notes,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        }));
    }

    async findByDentistId(dentistId, filters = {}) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const where = { dentistId };

        if (filters.status) where.status = filters.status;
        if (filters.startDate || filters.endDate) {
            where.date = {};
            if (filters.startDate) where.date[Op.gte] = filters.startDate;
            if (filters.endDate) where.date[Op.lte] = filters.endDate;
        }

        const appointments = await AppointmentModelClass.findAll({ where, order: [['date', 'DESC']] });

        return appointments.map(a => Appointment.restore({
            id: a.id,
            folio: a.folio,
            patientId: a.patientId,
            dentistId: a.dentistId,
            date: a.date,
            status: a.status,
            type: a.type,
            reason: a.reason,
            notes: a.notes,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        }));
    }

    async findAll(filters = {}) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.dentistId) where.dentistId = filters.dentistId;
        if (filters.patientId) where.patientId = filters.patientId;
        if (filters.startDate || filters.endDate) {
            where.date = {};
            if (filters.startDate) where.date[Op.gte] = filters.startDate;
            if (filters.endDate) where.date[Op.lte] = filters.endDate;
        }

        const appointments = await AppointmentModelClass.findAll({ where, order: [['date', 'DESC']] });

        return appointments.map(a => Appointment.restore({
            id: a.id,
            folio: a.folio,
            patientId: a.patientId,
            dentistId: a.dentistId,
            date: a.date,
            status: a.status,
            type: a.type,
            reason: a.reason,
            notes: a.notes,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        }));
    }

    async findOverlappingAppointment(dentistId, date, excludeId = null) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const oneHour = 60 * 60 * 1000;
        const startTime = new Date(date.getTime() - oneHour);
        const endTime = new Date(date.getTime() + oneHour);

        const where = {
            dentistId,
            status: { [Op.in]: ['scheduled', 'confirmed'] },
            date: {
                [Op.and]: [
                    { [Op.gt]: startTime },
                    { [Op.lt]: endTime }
                ]
            }
        };

        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }

        const appointment = await AppointmentModelClass.findOne({ where });
        if (!appointment) return null;

        return Appointment.restore({
            id: appointment.id,
            folio: appointment.folio,
            patientId: appointment.patientId,
            dentistId: appointment.dentistId,
            date: appointment.date,
            status: appointment.status,
            type: appointment.type,
            reason: appointment.reason,
            notes: appointment.notes,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
        });
    }

    async update(appointment) {
        const AppointmentModelClass = AppointmentModel.getModel();
        await AppointmentModelClass.update(
            {
                date: appointment.date,
                status: appointment.status,
                reason: appointment.reason,
                notes: appointment.notes,
            },
            { where: { id: appointment.id } }
        );
        return appointment;
    }

    async delete(id) {
        const AppointmentModelClass = AppointmentModel.getModel();
        await AppointmentModelClass.destroy({ where: { id } });
    }

    async count(filters = {}) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const where = {};
        if (filters.status) where.status = filters.status;
        if (filters.dentistId) where.dentistId = filters.dentistId;
        if (filters.patientId) where.patientId = filters.patientId;

        return await AppointmentModelClass.count({ where });
    }

    async findWithPagination(filters = {}, page = 1, limit = 10) {
        const AppointmentModelClass = AppointmentModel.getModel();
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.dentistId) where.dentistId = filters.dentistId;
        if (filters.patientId) where.patientId = filters.patientId;
        if (filters.startDate || filters.endDate) {
            where.date = {};
            if (filters.startDate) where.date[Op.gte] = filters.startDate;
            if (filters.endDate) where.date[Op.lte] = filters.endDate;
        }

        const offset = (page - 1) * limit;
        const { rows, count } = await AppointmentModelClass.findAndCountAll({
            where,
            limit,
            offset,
            order: [['date', 'DESC']],
        });

        return {
            rows: rows.map(a => Appointment.restore({
                id: a.id,
                folio: a.folio,
                patientId: a.patientId,
                dentistId: a.dentistId,
                date: a.date,
                status: a.status,
                type: a.type,
                reason: a.reason,
                notes: a.notes,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
            })),
            count,
        };
    }
}

module.exports = AppointmentRepository;
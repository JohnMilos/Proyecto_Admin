const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Penalty = require('../models/Penalty');

const generateFolio = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CITA-${timestamp}-${random}`;
};

const createAppointment = async (req, res) => {
    try {
        const { dentistId, appointmentDate, type, notes } = req.body;
        const patientId = req.user.id;

        // Verificar penalizaciones activas
        const activePenalty = await Penalty.findOne({
            where: {
                patientId,
                status: 'active'
            }
        });

        if (activePenalty) {
            return res.status(400).json({
                success: false,
                message: 'Tiene una penalización activa. Deberá pagar un cargo del 20% al finalizar la cita.'
            });
        }

        // Verificar disponibilidad del dentista
        const existingAppointment = await Appointment.findOne({
            where: {
                dentistId,
                appointmentDate: {
                    [Op.between]: [
                        new Date(new Date(appointmentDate).getTime() - 30 * 60000),
                        new Date(new Date(appointmentDate).getTime() + 30 * 60000)
                    ]
                },
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'El dentista no está disponible en ese horario'
            });
        }

        const appointment = await Appointment.create({
            folio: generateFolio(),
            patientId,
            dentistId,
            appointmentDate,
            type,
            notes
        });

        // Enviar notificación (implementar después)
        // await sendAppointmentConfirmation(appointment);

        res.status(201).json({
            success: true,
            message: 'Cita agendada exitosamente',
            data: { appointment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agendar cita',
            error: error.message
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const where = {};

        if (req.user.role === 'patient') {
            where.patientId = req.user.id;
        } else if (req.user.role === 'dentist') {
            where.dentistId = req.user.id;
        }

        if (status) {
            where.status = status;
        }

        const appointments = await Appointment.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'dentist',
                    attributes: ['id', 'name', 'email', 'phone', 'specialty']
                }
            ],
            order: [['appointmentDate', 'DESC']],
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        res.json({
            success: true,
            data: {
                appointments: appointments.rows,
                total: appointments.count,
                page: parseInt(page),
                totalPages: Math.ceil(appointments.count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener citas',
            error: error.message
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }

        // Verificar permisos
        if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para cancelar esta cita'
            });
        }

        const now = new Date();
        const appointmentTime = new Date(appointment.appointmentDate);
        const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

        // Aplicar penalización si se cancela con menos de 24 horas
        if (hoursDifference < 24 && req.user.role === 'patient') {
            await Penalty.create({
                patientId: appointment.patientId,
                appointmentId: appointment.id,
                reason: 'late_cancellation',
                percentage: 20.0
            });
        }

        await appointment.update({ status: 'cancelled' });

        res.json({
            success: true,
            message: 'Cita cancelada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cancelar cita',
            error: error.message
        });
    }
};

const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newAppointmentDate } = req.body;

        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }

        // Verificar que sea el paciente dueño de la cita
        if (appointment.patientId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para reagendar esta cita'
            });
        }

        const now = new Date();
        const appointmentTime = new Date(appointment.appointmentDate);
        const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            return res.status(400).json({
                success: false,
                message: 'Solo se puede reagendar con al menos 48 horas de anticipación'
            });
        }

        // Verificar disponibilidad del dentista en la nueva fecha
        const existingAppointment = await Appointment.findOne({
            where: {
                dentistId: appointment.dentistId,
                appointmentDate: {
                    [Op.between]: [
                        new Date(new Date(newAppointmentDate).getTime() - 30 * 60000),
                        new Date(new Date(newAppointmentDate).getTime() + 30 * 60000)
                    ]
                },
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                },
                id: { [Op.ne]: id }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'El dentista no está disponible en el nuevo horario'
            });
        }

        await appointment.update({
            appointmentDate: newAppointmentDate,
            status: 'scheduled'
        });

        res.json({
            success: true,
            message: 'Cita reagendada exitosamente',
            data: { appointment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al reagendar cita',
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    cancelAppointment,
    rescheduleAppointment
};
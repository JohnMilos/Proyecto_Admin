const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Penalty = require('../models/Penalty');
//const { sendAppointmentNotification } = require('../utils/notificationService');

// GENERAR FOLIO ÚNICO
const generateFolio = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CITA-${timestamp}-${random}`;
};

// CREAR CITA (DURACIÓN: 1 HORA)


const createAppointment = async (req, res) => {
    try {
        const { dentistId, date, type, notes } = req.body;  // ← CAMBIA Date por date
        const patientId = req.user.id;

        console.log('Intentando crear cita:', { dentistId, date, patientId });  // ← CAMBIA appointmentDate por date

        // VERIFICAR PENALIZACIONES ACTIVAS
        const activePenalty = await Penalty.findOne({
            where: {
                userId: patientId,
                status: 'active'
            }
        });

        if (activePenalty) {
            console.log('Paciente tiene penalización activa:', patientId);
            return res.status(400).json({
                success: false,
                message: 'Tiene una penalización activa. Deberá pagar un cargo del 20% al finalizar la cita.'
            });
        }

        // CONVERTIR Y VALIDAR FECHA
        const appointmentDateTime = new Date(date);  //
        if (isNaN(appointmentDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Fecha y hora de cita inválida'
            });
        }

        // VERIFICAR DISPONIBILIDAD DEL DENTISTA
        const oneHour = 60 * 60 * 1000;
        const startTime = new Date(appointmentDateTime.getTime() - oneHour);
        const endTime = new Date(appointmentDateTime.getTime() + oneHour);

        console.log('Verificando disponibilidad entre:', startTime, 'y', endTime);

        const existingAppointment = await Appointment.findOne({
            where: {
                dentistId,
                date: {
                                        [Op.and]: [
                        { [Op.gt]: startTime },
                        { [Op.lt]: endTime }
                    ]
                },
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                }
            }
        });

        if (existingAppointment) {
            console.log('Dentista no disponible en ese horario. Cita existente:', existingAppointment.folio);
            return res.status(400).json({
                success: false,
                message: 'El dentista no está disponible en ese horario'
            });
        }

        // CREAR LA CITA
        const appointment = await Appointment.create({
            folio: generateFolio(),
            patientId,
            dentistId,
            date: appointmentDateTime,
            type: type || 'first_visit',
            notes,
            status: 'scheduled'
        });

        console.log('Cita creada exitosamente:', appointment.folio);

        // OBTENER DATOS PARA NOTIFICACIÓN
        const patient = await User.findByPk(patientId);
        const dentist = await User.findByPk(dentistId);

        // ENVIAR NOTIFICACIÓN
        try {
            //await sendAppointmentNotification(appointment, patient, dentist, 'confirmation');
            console.log('Notificación enviada');
        } catch (notificationError) {
            console.log('Error en notificación, pero cita creada:', notificationError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Cita agendada exitosamente',
            data: {
                appointment: {
                    id: appointment.id,
                    folio: appointment.folio,
                    date: appointment.date,
                    status: appointment.status,
                    type: appointment.type
                }
            }
        });

    } catch (error) {
        console.error('Error al agendar cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agendar cita',
            error: error.message
        });
    }
};

// OBTENER CITAS
const getAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, dentistId, startDate, endDate } = req.query;
        const where = {};

        // FILTRAR POR ROL DE USUARIO
        if (req.user.role === 'patient') {
            where.patientId = req.user.id;
        } else if (req.user.role === 'dentist') {
            where.dentistId = req.user.id;
        }
        // ADMIN ve TODAS las citas (no aplica filtro)
        else if (req.user.role === 'admin') {
            // No se aplica filtro - admin ve todas las citas
        }

        if (dentistId) {
            where.dentistId = parseInt(dentistId);
        }

// Filtrar por rango de fechas
        if (startDate && endDate) {
            where.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            where.date = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            where.date = {
                [Op.lte]: new Date(endDate)
            };
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
            order: [['date', 'DESC']],
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
        console.error('Error al obtener citas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener citas',
            error: error.message
        });
    }
};

// CONSEGUIR las citas disponibles
const getOccupiedSlots = async (req, res) => {
    try {
        const { startDate, endDate, dentistId } = req.query;
        // Esto sirve para pruebas de validación en consola
        console.log('Obteniendo horas ocupadas:', { startDate, endDate, dentistId });


        // Construir el filtro WHERE
        const where = {
            status: {
                [Op.in]: ['scheduled', 'confirmed'] // Solo citas activas
            }
        };

        // Filtrar por dentista si se proporciona
        if (dentistId) {
            where.dentistId = parseInt(dentistId);
        }



        // Filtrar por rango de fechas si se proporciona
        if (startDate && endDate) {
            where.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            where.date = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            where.date = {
                [Op.lte]: new Date(endDate)
            };
        }

        // Obtener las citas
        const appointments = await Appointment.findAll({
            where,
            attributes: ['id', 'dentistId', 'date', 'status'], // Solo los campos necesarios
            include: [
                {
                    model: User,
                    as: 'dentist',
                    attributes: ['id', 'name', 'specialty'] // Info del dentista
                }
            ],
            order: [['date', 'ASC']] // Ordenar por fecha
        });

        // Formatear la respuesta
        const occupiedSlots = appointments.map(appointment => ({
            appointmentId: appointment.id,
            dentistId: appointment.dentistId,
            dentistName: appointment.dentist.name,
            dentistSpecialty: appointment.dentist.specialty,
            date: appointment.date,
            status: appointment.status,
            available: false // Siempre false porque son horas ocupadas
        }));

        console.log(`Encontradas ${occupiedSlots.length} horas ocupadas`);

        res.json({
            success: true,
            data: {
                occupiedSlots,
                total: occupiedSlots.length,
                message: occupiedSlots.length === 0 ?
                    'No hay horas ocupadas en el rango seleccionado' :
                    `${occupiedSlots.length} horas ocupadas encontradas`
            }
        });

    } catch (error) {
        console.error('Error al obtener horas ocupadas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener horas ocupadas',
            error: error.message
        });
    }
};
// CANCELAR CITA
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id, {
            include: [
                { model: User, as: 'patient' },
                { model: User, as: 'dentist' }
            ]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }

        // VERIFICAR PERMISOS
        if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para cancelar esta cita'
            });
        }

        const now = new Date();
        const appointmentTime = new Date(appointment.appointmentDate);
        const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

        console.log('Diferencia de horas para cancelación:', hoursDifference);

        // APLICAR PENALIZACIÓN SI SE CANCELA CON MENOS DE 24 HORAS
        if (hoursDifference < 24 && req.user.role === 'patient') {
            console.log('Aplicando penalización por cancelación tardía');
            await Penalty.create({
                patientId: appointment.patientId,
                appointmentId: appointment.id,
                reason: 'late_cancellation',
                percentage: 20.0,
                status: 'active'
            });
        }

        // ACTUALIZAR ESTADO DE LA CITA
        await appointment.update({ status: 'cancelled' });

        // ENVIAR NOTIFICACIÓN DE CANCELACIÓN
        try {
            //await sendAppointmentNotification(appointment, appointment.patient, appointment.dentist, 'cancellation');
        } catch (notificationError) {
            console.log('Error en notificación de cancelación:', notificationError.message);
        }

        res.json({
            success: true,
            message: hoursDifference < 24 ?
                'Cita cancelada. Se aplicó una penalización del 20% por cancelación tardía.' :
                'Cita cancelada exitosamente'
        });

    } catch (error) {
        console.error('Error al cancelar cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cancelar cita',
            error: error.message
        });
    }
};

// REAGENDAR CITA (DURACIÓN: 1 HORA)
const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newAppointmentDate } = req.body;

        const appointment = await Appointment.findByPk(id, {
            include: [
                { model: User, as: 'patient' },
                { model: User, as: 'dentist' }
            ]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }

        // VERIFICAR QUE SEA EL PACIENTE DUEÑO DE LA CITA
        if (appointment.patientId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para reagendar esta cita'
            });
        }

        const now = new Date();
        const appointmentTime = new Date(appointment.date);  // ← CAMBIO: appointmentDate por date
        const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

        console.log('Diferencia de horas para reagendar:', hoursDifference);

        // VERIFICAR LÍMITE DE 48 HORAS
        if (hoursDifference < 48) {
            return res.status(400).json({
                success: false,
                message: 'Solo se puede reagendar con al menos 48 horas de anticipación'
            });
        }

        // VALIDAR NUEVA FECHA
        const newAppointmentDateTime = new Date(newAppointmentDate);
        if (isNaN(newAppointmentDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Nueva fecha y hora de cita inválida'
            });
        }

        // VERIFICAR DISPONIBILIDAD DEL DENTISTA EN NUEVA FECHA (1 HORA)
        const oneHour = 60 * 60 * 1000;
        const startTime = new Date(newAppointmentDateTime.getTime() - oneHour);
        const endTime = new Date(newAppointmentDateTime.getTime() + oneHour);

        console.log('Verificando disponibilidad en nueva fecha entre:', startTime, 'y', endTime);

        const existingAppointment = await Appointment.findOne({
            where: {
                dentistId: appointment.dentistId,
                date: {  // ← CAMBIO: appointmentDate por date
                                        [Op.and]: [
                        { [Op.gt]: startTime },
                        { [Op.lt]: endTime }
                    ]
                },
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                },
                id: { [Op.ne]: id }
            }
        });

        if (existingAppointment) {
            console.log('Dentista no disponible en el nuevo horario. Cita existente:', existingAppointment.id);
            return res.status(400).json({
                success: false,
                message: 'El dentista no está disponible en el nuevo horario'
            });
        }

        // ACTUALIZAR CITA CON NUEVA FECHA
        await appointment.update({
            date: newAppointmentDateTime,  // ← CAMBIO: appointmentDate por date
            status: 'scheduled'
        });

        // ENVIAR NOTIFICACIÓN DE REAGENDADO
        try {
            //await sendAppointmentNotification(appointment, appointment.patient, appointment.dentist, 'confirmation');
        } catch (notificationError) {
            console.log('Error en notificación de reagendo:', notificationError.message);
        }

        res.json({
            success: true,
            message: 'Cita reagendada exitosamente',
            data: { appointment }
        });

    } catch (error) {
        console.error('Error al reagendar cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al reagendar cita',
            error: error.message
        });
    }
};

/**
 * MARCAR CITA COMO COMPLETADA (solo dentistas y admin)
 */
const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, treatment } = req.body; // Opcional: notas del tratamiento

        const appointment = await Appointment.findByPk(id, {
            include: [
                { model: User, as: 'patient' },
                { model: User, as: 'dentist' }
            ]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }

        // Verificar permisos (solo el dentista asignado o admin)
        if (req.user.role === 'dentist' && appointment.dentistId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para completar esta cita'
            });
        }

        // Verificar que la cita esté en estado scheduled
        if (appointment.status !== 'scheduled') {
            return res.status(400).json({
                success: false,
                message: `No se puede completar una cita con estado: ${appointment.status}`
            });
        }

        // Actualizar a completed
        await appointment.update({
            status: 'completed',
            notes: notes || appointment.notes // Mantener notas existentes o agregar nuevas
        });

        console.log('Cita marcada como completada:', appointment.id);

        res.json({
            success: true,
            message: 'Cita marcada como completada exitosamente',
            data: { appointment }
        });

    } catch (error) {
        console.error('Error al completar cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al completar cita',
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    cancelAppointment,
    rescheduleAppointment,
    getOccupiedSlots,
    completeAppointment
};


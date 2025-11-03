const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

/**
 * Crear un nuevo expediente médico
 * Solo dentistas y administradores pueden crear expedientes
 */
const createMedicalRecord = async (req, res) => {
    try {
        const { patientId, diagnosis, treatment, prescriptions, notes, appointmentId } = req.body;
        const dentistId = req.user.id;

        console.log('Creando expediente médico:', { patientId, dentistId });

        // Verificar permisos (solo dentistas y admin)
        if (req.user.role !== 'dentist' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para crear expedientes médicos'
            });
        }

        // Validar campos requeridos
        if (!patientId || !diagnosis) {
            return res.status(400).json({
                success: false,
                message: 'El ID del paciente y el diagnóstico son requeridos'
            });
        }

        // Verificar que el paciente existe
        const patient = await User.findByPk(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(404).json({
                success: false,
                message: 'Paciente no encontrado'
            });
        }

        // Crear el expediente médico
        const medicalRecord = await MedicalRecord.create({
            patientId,
            diagnosis,
            treatment: treatment || null,
            prescriptions: prescriptions || null,
            notes: notes || null,
            appointmentId: appointmentId || null
        });

        // Cargar datos relacionados para la respuesta
        const recordWithDetails = await MedicalRecord.findByPk(medicalRecord.id, {
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'dentist',
                    attributes: ['id', 'name', 'email', 'specialty']
                },
                {
                    model: Appointment,
                    as: 'appointment',
                    attributes: ['id', 'date', 'type']
                }
            ]
        });

        console.log('Expediente médico creado exitosamente:', medicalRecord.id);

        res.status(201).json({
            success: true,
            message: 'Expediente médico creado exitosamente',
            data: {
                medicalRecord: recordWithDetails
            }
        });

    } catch (error) {
        console.error('Error al crear expediente médico:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear expediente médico',
            error: error.message
        });
    }
};

/**
 * Obtener expedientes médicos de un paciente
 * Pacientes ven solo sus expedientes, dentistas ven expedientes de sus pacientes, admin ve todo
 */
const getPatientRecords = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        console.log('Obteniendo expedientes para paciente:', patientId);

        const where = { patientId };

        // Verificar permisos
        if (req.user.role === 'patient') {
            // Pacientes solo pueden ver sus propios expedientes
            if (parseInt(patientId) !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tiene permisos para ver estos expedientes médicos'
                });
            }
        } else if (req.user.role === 'dentist') {
            // Dentistas solo ven expedientes de sus pacientes
            // (aquí podrías agregar lógica adicional si es necesario)
        }
        // Admin puede ver todo (no se aplican restricciones adicionales)

        const medicalRecords = await MedicalRecord.findAndCountAll({
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
                    attributes: ['id', 'name', 'email', 'specialty']
                },
                {
                    model: Appointment,
                    as: 'appointment',
                    attributes: ['id', 'date', 'type', 'reason']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        res.json({
            success: true,
            data: {
                medicalRecords: medicalRecords.rows,
                total: medicalRecords.count,
                page: parseInt(page),
                totalPages: Math.ceil(medicalRecords.count / limit)
            }
        });

    } catch (error) {
        console.error('Error al obtener expedientes médicos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener expedientes médicos',
            error: error.message
        });
    }
};

/**
 * Obtener un expediente médico específico
 */
const getMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const medicalRecord = await MedicalRecord.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'dentist',
                    attributes: ['id', 'name', 'email', 'specialty']
                },
                {
                    model: Appointment,
                    as: 'appointment',
                    attributes: ['id', 'date', 'type', 'reason']
                }
            ]
        });

        if (!medicalRecord) {
            return res.status(404).json({
                success: false,
                message: 'Expediente médico no encontrado'
            });
        }

        // Verificar permisos
        if (req.user.role === 'patient' && medicalRecord.patientId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para ver este expediente médico'
            });
        }

        res.json({
            success: true,
            data: {
                medicalRecord
            }
        });

    } catch (error) {
        console.error('Error al obtener expediente médico:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener expediente médico',
            error: error.message
        });
    }
};

/**
 * Actualizar un expediente médico
 * Solo el dentista que lo creó o un admin pueden actualizarlo
 */
const updateMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnosis, treatment, prescriptions, notes } = req.body;

        const medicalRecord = await MedicalRecord.findByPk(id);

        if (!medicalRecord) {
            return res.status(404).json({
                success: false,
                message: 'Expediente médico no encontrado'
            });
        }

        // Verificar permisos (solo el dentista creador o admin)
        if (req.user.role !== 'admin' && medicalRecord.dentistId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para actualizar este expediente médico'
            });
        }

        // Actualizar solo los campos proporcionados
        const updates = {};
        if (diagnosis !== undefined) updates.diagnosis = diagnosis;
        if (treatment !== undefined) updates.treatment = treatment;
        if (prescriptions !== undefined) updates.prescriptions = prescriptions;
        if (notes !== undefined) updates.notes = notes;

        await medicalRecord.update(updates);

        // Cargar datos actualizados
        const updatedRecord = await MedicalRecord.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'dentist',
                    attributes: ['id', 'name', 'email', 'specialty']
                }
            ]
        });

        console.log('Expediente médico actualizado:', id);

        res.json({
            success: true,
            message: 'Expediente médico actualizado exitosamente',
            data: {
                medicalRecord: updatedRecord
            }
        });

    } catch (error) {
        console.error('Error al actualizar expediente médico:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar expediente médico',
            error: error.message
        });
    }
};

module.exports = {
    createMedicalRecord,
    getPatientRecords,
    getMedicalRecord,
    updateMedicalRecord
};
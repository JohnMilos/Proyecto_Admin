const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

/**
 * Crear un nuevo expediente médico
 */
const createMedicalRecord = async (req, res) => {
    try {
        const { patientId, diagnosis, treatment, prescriptions, notes } = req.body;

        console.log('Creando expediente médico:', { patientId });

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
        if (!patient) {
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
            notes: notes || null
        });

        console.log('Expediente médico creado exitosamente:', medicalRecord.id);

        res.status(201).json({
            success: true,
            message: 'Expediente médico creado exitosamente',
            data: {
                medicalRecord: {
                    id: medicalRecord.id,
                    patientId: medicalRecord.patientId,
                    diagnosis: medicalRecord.diagnosis,
                    treatment: medicalRecord.treatment,
                    prescriptions: medicalRecord.prescriptions,
                    notes: medicalRecord.notes,
                    createdAt: medicalRecord.createdAt,
                    updatedAt: medicalRecord.updatedAt
                }
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
 */
const getPatientRecords = async (req, res) => {
    try {
        const { patientId } = req.params;

        console.log('Obteniendo expedientes para paciente:', patientId);

        const where = { patientId };

        // Verificar permisos
        if (req.user.role === 'patient' && parseInt(patientId) !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para ver estos expedientes médicos'
            });
        }

        const medicalRecords = await MedicalRecord.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                medicalRecords
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

        const medicalRecord = await MedicalRecord.findByPk(id);

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

        // Verificar permisos (solo dentistas y admin pueden actualizar)
        if (req.user.role !== 'dentist' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para actualizar expedientes médicos'
            });
        }

        // Actualizar solo los campos proporcionados
        const updates = {};
        if (diagnosis !== undefined) updates.diagnosis = diagnosis;
        if (treatment !== undefined) updates.treatment = treatment;
        if (prescriptions !== undefined) updates.prescriptions = prescriptions;
        if (notes !== undefined) updates.notes = notes;

        await medicalRecord.update(updates);

        console.log('Expediente médico actualizado:', id);

        res.json({
            success: true,
            message: 'Expediente médico actualizado exitosamente',
            data: {
                medicalRecord
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
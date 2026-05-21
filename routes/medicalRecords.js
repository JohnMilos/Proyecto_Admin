const express = require('express');
const router = express.Router();

// Importar controladores
const {
    createMedicalRecord,
    getPatientRecords,
    getMedicalRecord,
    updateMedicalRecord
} = require('../controllers/medicalRecordController');

// Importar middlewares
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

/**
 * RUTAS DE EXPEDIENTES MEDICOS
 * Todas requieren autenticacion JWT
 */

/**
 * POST /api/medical-records
 * Crear un expediente medico para un paciente
 *
 * Permisos: Dentista y Admin
 * Body requerido:
 * - patientId: ID del paciente
 * - diagnosis: Texto del diagnostico
 * - treatment: Texto del tratamiento (opcional)
 * - prescriptions: Texto de prescripciones (opcional)
 * - notes: Notas adicionales (opcional)
 */
router.post('/', auth, authorize('dentist', 'admin'), createMedicalRecord);

/**
 * GET /api/medical-records/patient/:patientId
 * Listar expedientes de un paciente
 *
 * Permisos:
 * - Paciente: solo sus expedientes
 * - Dentista: expedientes de sus pacientes (segun logica del controller)
 * - Admin: cualquier paciente
 * Params URL:
 * - patientId: ID del paciente
 */
router.get('/patient/:patientId', auth, getPatientRecords);

/**
 * GET /api/medical-records/:id
 * Obtener un expediente medico por ID
 *
 * Permisos: Paciente propietario, Dentista asignado o Admin
 * Params URL:
 * - id: ID del expediente
 */
router.get('/:id', auth, getMedicalRecord);

/**
 * PUT /api/medical-records/:id
 * Actualizar un expediente medico
 *
 * Permisos: Dentista o Admin
 * Params URL:
 * - id: ID del expediente
 * Body: campos a actualizar (diagnosis, treatment, prescriptions, notes)
 */
router.put('/:id', auth, authorize('dentist', 'admin'), updateMedicalRecord);

module.exports = router;


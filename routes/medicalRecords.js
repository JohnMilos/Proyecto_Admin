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
 * RUTAS DE EXPEDIENTES MÉDICOS
 */
router.post('/', auth, authorize('dentist', 'admin'), createMedicalRecord);
router.get('/patient/:patientId', auth, getPatientRecords);
router.get('/:id', auth, getMedicalRecord);
router.put('/:id', auth, authorize('dentist', 'admin'), updateMedicalRecord);

module.exports = router;
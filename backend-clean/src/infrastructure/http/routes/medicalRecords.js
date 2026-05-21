const express = require('express');
const { auth, authorize } = require('../middleware/auth');

function medicalRecordRoutes(container) {
    const router = express.Router();
    const medicalRecordController = container.get('MedicalRecordController');

    router.post('/', auth, authorize('dentist', 'admin'), (req, res) => medicalRecordController.create(req, res));
    router.get('/patient/:patientId', auth, (req, res) => medicalRecordController.getByPatient(req, res));
    router.get('/:id', auth, (req, res) => medicalRecordController.getById(req, res));
    router.put('/:id', auth, authorize('dentist', 'admin'), (req, res) => medicalRecordController.update(req, res));

    return router;
}

module.exports = medicalRecordRoutes;
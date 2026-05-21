const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

function appointmentRoutes(container) {
    const router = express.Router();
    const appointmentController = container.get('AppointmentController');

    router.post('/', auth, authorize('patient'), validateAppointment, (req, res) => appointmentController.create(req, res));
    router.get('/', auth, (req, res) => appointmentController.getAll(req, res));
    router.get('/occupied-slots', auth, (req, res) => appointmentController.getOccupiedSlots(req, res));
    router.patch('/:id/cancel', auth, (req, res) => appointmentController.cancel(req, res));
    router.patch('/:id/reschedule', auth, authorize('patient'), (req, res) => appointmentController.reschedule(req, res));
    router.patch('/:id/complete', auth, authorize('dentist', 'admin'), (req, res) => appointmentController.complete(req, res));

    return router;
}

module.exports = appointmentRoutes;
const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    cancelAppointment,
    rescheduleAppointment
} = require('../controllers/appointmentController');
const { auth, authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

router.post('/', auth, authorize('patient'), validateAppointment, createAppointment);
router.get('/', auth, getAppointments);
router.patch('/:id/cancel', auth, cancelAppointment);
router.patch('/:id/reschedule', auth, authorize('patient'), rescheduleAppointment);

module.exports = router;
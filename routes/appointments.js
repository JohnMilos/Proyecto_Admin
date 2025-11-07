const express = require('express');
const router = express.Router();

// Importar controladores
const {
    createAppointment,
    getAppointments,
    cancelAppointment,
    rescheduleAppointment,
    getOccupiedSlots
} = require('../controllers/appointmentController');

// Importar middlewares
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

/**
 * RUTAS DE CITAS
 *
 * Todas las rutas requieren autenticación JWT
 * Los permisos específicos se controlan en los controladores
 */

/**
 * POST /api/appointments
 * Crear una nueva cita
 *
 * Permisos: Solo pacientes pueden crear citas
 * Body requerido:
 * - dentistId: ID del dentista
 * - appointmentDate: Fecha y hora de la cita (YYYY-MM-DDTHH:mm:ss)
 * - type: Tipo de cita (first_visit, follow_up, etc.)
 * - notes: Notas opcionales
 */
router.post('/', auth, authorize('patient'), validateAppointment, createAppointment);

/**
 * GET /api/appointments
 * Obtener listado de citas
 *
 * Permisos:
 * - Pacientes: Solo sus citas
 * - Dentistas: Solo citas asignadas a ellos
 * - Administradores: Todas las citas
 *
 * Query params opcionales:
 * - status: Filtrar por estado (scheduled, confirmed, cancelled, etc.)
 * - page: Número de página para paginación
 * - limit: Límite de resultados por página
 */
router.get('/', auth, getAppointments);

/**
 * PATCH /api/appointments/:id/cancel
 * Cancelar una cita específica
 *
 * Permisos:
 * - Pacientes: Solo pueden cancelar sus propias citas
 * - Dentistas: Solo pueden cancelar citas asignadas a ellos
 * - Administradores: Pueden cancelar cualquier cita
 *
 * Parámetros URL:
 * - id: ID de la cita a cancelar
 */
router.patch('/:id/cancel', auth, cancelAppointment);

/**
 * PATCH /api/appointments/:id/reschedule
 * Reagendar una cita específica
 *
 * Permisos: Solo pacientes pueden reagendar sus propias citas
 *
 * Parámetros URL:
 * - id: ID de la cita a reagendar
 *
 * Body requerido:
 * - newAppointmentDate: Nueva fecha y hora para la cita
 */
router.patch('/:id/reschedule', auth, authorize('patient'), rescheduleAppointment);

// ... rutas existentes ...

/**
 * GET /api/appointments/occupied-slots
 * Obtener horas ocupadas de los dentistas para ver disponibilidad
 *
 * Query params opcionales:
 * - startDate: Fecha inicial del rango (YYYY-MM-DD)
 * - endDate: Fecha final del rango (YYYY-MM-DD)
 * - dentistId: ID específico de un dentista
 *
 * Respuesta: Lista de horas ocupadas con info del dentista y cita
 */
router.get('/occupied-slots', auth, getOccupiedSlots);

// Exportar el router
module.exports = router;
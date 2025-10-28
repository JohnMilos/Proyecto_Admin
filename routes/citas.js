const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const { esPaciente, esProfesional, esAdministrador } = require('../middlewares/roleMiddleware');
const { agendarCita, obtenerCitas, cancelarCita, reagendarCita, aceptarCita, terminarCita } = require('../controllers/citaController');

// paciente puede agendar, ver sus citas, cancelar, reagendar
router.post('/', verificarToken, esPaciente, agendarCita);
router.get('/', verificarToken, esPaciente, obtenerCitas);
router.patch('/:id/cancelar', verificarToken, esPaciente, cancelarCita);
router.patch('/:id/reagendar', verificarToken, esPaciente, reagendarCita);

// denstistas puede aceptar y terminar citas
router.patch('/:id/aceptar', verificarToken, esProfesional, aceptarCita);
router.patch('/:id/terminar', verificarToken, esProfesional, terminarCita);

// el administrador puede ver todas las citas
router.get('/admin', verificarToken, esAdministrador, obtenerCitas); // Obtener todas las citas

module.exports = router;
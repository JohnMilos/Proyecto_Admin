const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const { esProfesional } = require('../middlewares/roleMiddleware');
const { crearExpediente, obtenerExpediente, actualizarExpediente } = require('../controllers/expedienteController');

router.post('/', verificarToken, esProfesional, crearExpediente);
router.get('/:pacienteId', verificarToken, esProfesional, obtenerExpediente);
router.put('/:pacienteId', verificarToken, esProfesional, actualizarExpediente);

module.exports = router;
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const { esProfesional } = require('../middlewares/roleMiddleware');
const { crearPenalizacion, obtenerPenalizaciones, actualizarPenalizacion, eliminarPenalizacion } = require('../controllers/penalizacionController');

router.post('/', verificarToken, esProfesional, crearPenalizacion);
router.get('/:pacienteId', verificarToken, esProfesional, obtenerPenalizaciones);
router.put('/:id', verificarToken, esProfesional, actualizarPenalizacion);
router.delete('/:id', verificarToken, esProfesional, eliminarPenalizacion);

module.exports = router;
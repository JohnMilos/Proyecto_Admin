const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const { esProfesional } = require('../middlewares/roleMiddleware');
const { crearEspacio, obtenerEspacios, actualizarEspacio, eliminarEspacio } = require('../controllers/espacioController');

router.post('/', verificarToken, esProfesional, crearEspacio);
router.get('/', verificarToken, esProfesional, obtenerEspacios);
router.put('/:id', verificarToken, esProfesional, actualizarEspacio);
router.delete('/:id', verificarToken, esProfesional, eliminarEspacio);

module.exports = router;
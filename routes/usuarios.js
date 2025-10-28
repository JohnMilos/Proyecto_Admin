// esto es para que solamente el administrador pueda gestionar a los usuarios xd

const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const { esAdministrador } = require('../middlewares/roleMiddleware');
const { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, inhabilitarUsuario } = require('../controllers/usuarioController');

router.get('/', verificarToken, esAdministrador, obtenerUsuarios);
router.get('/:id', verificarToken, esAdministrador, obtenerUsuario);
router.put('/:id', verificarToken, esAdministrador, actualizarUsuario);
router.delete('/:id', verificarToken, esAdministrador, eliminarUsuario);
router.patch('/:id/inhabilitar', verificarToken, esAdministrador, inhabilitarUsuario);

module.exports = router;
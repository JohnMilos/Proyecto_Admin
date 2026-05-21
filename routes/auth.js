const express = require('express');
const router = express.Router();



// Importar controladores
const {
    register,
    login,
    getProfile,
    getActiveDentists,
    deleteUser,
    deactivateUser,
    getAllUsers
} = require('../controllers/authController');

// Importar middlewares
const { auth, authorize } = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validation');

/**
 * RUTAS DE AUTENTICACIÓN Y USUARIOS
 *
 * Algunas rutas son públicas (register, login)
 * Otras requieren autenticación JWT (profile)
 */

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario en el sistema
 *
 * Esta ruta es PÚBLICA pero tiene restricciones:
 * - Cualquiera puede registrarse como PACIENTE (role: 'patient')
 * - Solo ADMINISTRADORES autenticados pueden crear DENTISTAS o ADMINISTRADORES
 *
 * Body requerido:
 * - name: Nombre completo (6-25 caracteres)
 * - email: Email único y válido
 * - phone: Teléfono único (mínimo 10 dígitos)
 * - password: Contraseña segura (8+ caracteres, mayúscula, minúscula, número, carácter especial)
 * - role: Rol del usuario (patient, dentist, admin) - Opcional, por defecto 'patient'
 * - specialty: Especialidad del dentista - Requerido solo si role = 'dentist'
 *
 * Respuesta: Usuario creado y token JWT
 */
router.post('/register', validateUserRegistration, register);

/**
 * POST /api/auth/login
 * Iniciar sesión en el sistema
 *
 * Esta ruta es PÚBLICA
 *
 * Body requerido:
 * - email: Email del usuario
 * - password: Contraseña del usuario
 *
 * Respuesta: Datos del usuario y token JWT
 */
router.post('/login', login);

/**
 * GET /api/auth/profile
 * Obtener el perfil del usuario autenticado
 *
 * Esta ruta requiere AUTENTICACIÓN JWT
 * Cualquier usuario autenticado puede ver su propio perfil
 *
 * Headers requeridos:
 * - Authorization: Bearer <token_jwt>
 *
 * Respuesta: Datos del usuario (sin contraseña)
 */
router.get('/profile', auth, getProfile);


/**
 * GET /api/auth/active-dentists
 * Listar dentistas activos ordenados por nombre
 *
 * Permisos: Publico
 *
 * Respuesta: { success, data: { dentists: [], total, message } }
 */
router.get('/active-dentists', getActiveDentists);

/**
 * GET /api/auth/users
 * Listar todos los usuarios
 *
 * Permisos: Solo ADMIN
 * Query opcional:
 * - q: Búsqueda por id (exacto si numérico), nombre o email (LIKE)
 *
 * Respuesta: { success, data: { users: [], total } }
 */
router.get('/users', auth, authorize('admin'), getAllUsers);

/**
 * DELETE /api/auth/user/:userId
 * Eliminar un usuario definitivamente
 *
 * Permisos: Solo ADMIN
 * Params URL:
 * - userId: ID del usuario a eliminar
 *
 * Respuesta: { success, message, data: { user: { id, name, email, role } } }
 */
router.delete('/user/:userId', auth, authorize('admin'), deleteUser);

/**
 * PATCH /api/auth/user/:userId/deactivate
 * Activar/desactivar un usuario (cambio de isActive)
 *
 * Permisos: Solo ADMIN
 * Params URL:
 * - userId: ID del usuario
 * Body:
 * - isActive: boolean
 *
 * Respuesta: { success, message, data: { user: { id, name, email, role, isActive } } }
 */
router.patch('/user/:userId/deactivate', auth, authorize('admin'), deactivateUser);


// Exportar el router
module.exports = router;

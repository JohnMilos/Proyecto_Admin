const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Penalty = require('../models/Penalty');

/**
 * Genera un token JWT para autenticación
 * @param {number} id - ID del usuario
 * @returns {string} Token JWT firmado
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'dental_secret', {
        expiresIn: '30d',
    });
};

/**
 * Valida los datos de registro antes de crear el usuario
 * @param {Object} data - Datos del usuario a validar
 * @returns {Object} Resultado de la validación
 */
const validateRegistrationData = async (data) => {
    const { name, email, phone, password, role, specialty } = data;
    const errors = [];

    // Validar campos requeridos
    if (!name || !email || !phone || !password) {
        errors.push('Todos los campos son requeridos: nombre, email, teléfono y contraseña');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('El formato del email no es válido');
    }

    // Validar longitud del nombre (6-25 caracteres como en los requisitos)
    if (name && (name.length < 6 || name.length > 25)) {
        errors.push('El nombre debe tener entre 6 y 25 caracteres');
    }

    // Validar formato de teléfono (mínimo 10 dígitos)
    const phoneRegex = /^\d{10,}$/;
    if (phone && !phoneRegex.test(phone.replace(/\D/g, ''))) {
        errors.push('El número de teléfono debe tener al menos 10 dígitos');
    }

    // Validar fortaleza de la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (password && (!passwordRegex.test(password) || password.length < 8)) {
        errors.push('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
    }

    // Validar rol
    const allowedRoles = ['patient', 'dentist', 'admin'];
    if (role && !allowedRoles.includes(role)) {
        errors.push('Rol no válido. Los roles permitidos son: patient, dentist, admin');
    }

    // Validar especialidad para dentistas
    if (role === 'dentist' && !specialty) {
        errors.push('La especialidad es requerida para dentistas');
    }

    // Verificar duplicados solo si no hay errores previos
    if (errors.length === 0) {
        // Verificar si el email ya está registrado
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            errors.push('El correo electrónico ya está en uso');
        }

        // Verificar si el teléfono ya está registrado
        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) {
            errors.push('El número de teléfono ya está en uso');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Controlador para registro de nuevos usuarios
 * Maneja el registro de pacientes, dentistas y administradores
 */
const register = async (req, res) => {
    try {
        const { name, email, phone, password, role, specialty } = req.body;

        console.log('Intentando registrar usuario:', { name, email, phone, role });

        // Validar datos de registro
        const validation = await validateRegistrationData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: validation.errors
            });
        }

        // Crear el nuevo usuario en la base de datos
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.replace(/\D/g, ''), // Remover caracteres no numéricos
            password,
            role: role || 'patient',
            specialty: role === 'dentist' ? specialty.trim() : null
        });

        // Generar token JWT para el nuevo usuario
        const token = generateToken(user.id);

        console.log('Usuario registrado exitosamente:', user.email);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    specialty: user.specialty
                },
                token
            }
        });

    } catch (error) {
        console.error('Error en registro de usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor durante el registro',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

/**
 * Valida los datos de login
 * @param {Object} data - Datos de login
 * @returns {Object} Resultado de la validación
 */
const validateLoginData = (data) => {
    const { email, password } = data;
    const errors = [];

    if (!email || !password) {
        errors.push('Email y contraseña son requeridos');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('El formato del email no es válido');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Controlador para inicio de sesión de usuarios
 * Verifica credenciales y genera token de autenticación
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Intentando login para:', email);

        // Validar datos de login
        const validation = validateLoginData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: validation.errors
            });
        }

        // Buscar usuario por email
        const user = await User.findOne({
            where: {
                email: email.toLowerCase().trim()
            }
        });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        console.log('Usuario encontrado - ID:', user.id, 'Email:', user.email);

        // Verificar contraseña
        const isValidPassword = await user.validatePassword(password);
        console.log('Resultado validación contraseña:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token JWT
        const token = generateToken(user.id);

        console.log('Login exitoso para:', user.email);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    specialty: user.specialty
                },
                token
            }
        });

    } catch (error) {
        console.error('Error en login de usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor durante el login',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

/**
 * Controlador para obtener el perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener perfil',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

/**
 * Obtener todos los dentistas activos
 * Para que los pacientes vean solo dentistas disponibles
 */
const getActiveDentists = async (req, res) => {
    try {
        console.log('Obteniendo dentistas activos...');

        const activeDentists = await User.findAll({
            where: {
                role: 'dentist',
                isActive: true
            },
            attributes: ['id', 'name', 'email', 'phone', 'specialty', 'isActive'],
            order: [['name', 'ASC']]
        });

        console.log(`Encontrados ${activeDentists.length} dentistas activos`);

        res.json({
            success: true,
            data: {
                dentists: activeDentists,
                total: activeDentists.length,
                message: activeDentists.length === 0 ?
                    'No hay dentistas activos en este momento' :
                    `${activeDentists.length} dentistas activos encontrados`
            }
        });

    } catch (error) {
        console.error('Error al obtener dentistas activos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener dentistas activos',
            error: error.message
        });
    }
};

/**
 * elimina al usuario (solo admin) de la base de datos
 *
 */
/**
 * DESACTIVAR USUARIO (solo admin)
 * En lugar de eliminar, cambia isActive a false
 */
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log('Eliminando usuario ID:', userId);

        // Verificación redundante: la ruta ya exige admin, pero mantenemos la defensa
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Solo administradores pueden eliminar usuarios'
            });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Evitar que un admin se elimine a sí mismo
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        // Eliminar entidades relacionadas para evitar conflictos de FK
        await Penalty.destroy({ where: { userId: user.id } });
        await MedicalRecord.destroy({ where: { patientId: user.id } });
        await Appointment.destroy({ where: { [Op.or]: [{ patientId: user.id }, { dentistId: user.id }] } });

        const deletedInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        await user.destroy();

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: { user: deletedInfo }
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

/**
 * desactivar a un usuario (solo ADMIN)
 */
const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        console.log('Actualizando estado de usuario ID:', userId, 'nuevo estado:', isActive);

        // Verificar que es admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Solo administradores pueden cambiar estados de usuarios'
            });
        }

        // Buscar el usuario
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No permitir que un admin se desactive a sí mismo
        if (user.id === req.user.id && isActive === false) {
            return res.status(400).json({
                success: false,
                message: 'No puedes desactivar tu propia cuenta'
            });
        }

        // Actualizar el estado
        await user.update({ isActive });

        console.log('Estado de usuario actualizado:', userId, 'isActive:', isActive);

        res.json({
            success: true,
            message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            }
        });

    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado del usuario',
            error: error.message
        });
    }
};

/**
 * Obtener todos los usuarios (solo ADMIN)
 * GET /api/auth/users?q=texto
 * Param opcional: q -> busca por id (exacto si numérico), name o email (LIKE)
 */
const getAllUsers = async (req, res) => {
    try {
        const q = (req.query.q || '').toString().trim();
        console.log('Obteniendo usuarios. Filtro q =', q);

        const where = {};
        if (q) {
            const or = [
                { name: { [Op.like]: `%${q}%` } },
                { email: { [Op.like]: `%${q}%` } }
            ];
            const asNumber = Number(q);
            if (!Number.isNaN(asNumber)) {
                or.push({ id: asNumber });
            }
            where[Op.or] = or;
        }

        const users = await User.findAll({
            where,
            attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive'],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                users,
                total: users.length
            }
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getActiveDentists,
    deleteUser,
    deactivateUser,
    getAllUsers
};

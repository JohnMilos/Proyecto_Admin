const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticación JWT
 */
const auth = async (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. No se proporcionó token de autenticación.'
            });
        }

        // Verificar que el header tenga el formato correcto
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido. Use: Bearer <token>'
            });
        }

        const token = parts[1];

        // Verificar que el token no esté vacío
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación vacío.'
            });
        }

        // Verificar y decodificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dental_secret');

        // Buscar el usuario en la base de datos usando el ID del token
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token no válido. Usuario no encontrado.'
            });
        }

        // ✅ CORREGIDO: Verificar que la cuenta del usuario esté activa (usa isActive)
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada. Contacte al administrador.'
            });
        }

        // Establecer el usuario en el request para uso en controllers
        req.user = user;

        // Continuar al siguiente middleware o controller
        next();

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);

        // Manejar diferentes tipos de errores de JWT
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación inválido.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación expirado.'
            });
        }

        // Error genérico del servidor
        res.status(500).json({
            success: false,
            message: 'Error en la autenticación.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

/**
 * Middleware de autorización por roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Verificar que el usuario esté autenticado
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Autenticación requerida.'
            });
        }

        // Verificar que el usuario tenga uno de los roles permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. El rol ${req.user.role} no tiene permisos para esta acción. Roles permitidos: ${roles.join(', ')}`
            });
        }

        // Usuario autorizado, continuar
        next();
    };
};

module.exports = { auth, authorize };
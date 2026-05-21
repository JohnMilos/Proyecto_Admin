const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. No se proporcionó token de autenticación.',
            });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido. Use: Bearer <token>',
            });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dental_secret');

        // Aquí necesitamos el userRepository - se pasa desde el container
        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expirado' });
        }
        res.status(500).json({ success: false, message: 'Error en autenticación' });
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Rol ${req.user.role} no tiene permisos. Roles permitidos: ${roles.join(', ')}`,
            });
        }
        next();
    };
}

module.exports = { auth, authorize };
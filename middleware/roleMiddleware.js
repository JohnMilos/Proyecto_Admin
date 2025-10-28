/// Este es para verificar el rol de administrador

const esAdministrador = (req, res, next) => {
    if (req.usuario.rol !== 'administrador') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};

const esProfesional = (req, res, next) => {
    if (req.usuario.rol !== 'profesional') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de profesional.' });
    }
    next();
};

const esPaciente = (req, res, next) => {
    if (req.usuario.rol !== 'paciente') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de paciente.' });
    }
    next();
};

module.exports = { esAdministrador, esProfesional, esPaciente };
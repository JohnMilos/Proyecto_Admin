const { body, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errorMessages,
        });
    }
    next();
}

const validateUserRegistration = [
    body('name').notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 6, max: 100 }).withMessage('El nombre debe tener entre 6 y 100 caracteres'),
    body('email').notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido').normalizeEmail(),
    body('phone').notEmpty().withMessage('El teléfono es requerido')
        .isMobilePhone('any').withMessage('Teléfono inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleValidationErrors,
];

const validateAppointment = [
    body('dentistId').notEmpty().withMessage('El ID del dentista es requerido')
        .isInt({ min: 1 }).withMessage('ID de dentista inválido'),
    body('date').notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('Formato de fecha inválido'),
    handleValidationErrors,
];

module.exports = {
    validateUserRegistration,
    validateAppointment,
    handleValidationErrors,
};
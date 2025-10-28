const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

const validateUserRegistration = [
    body('name')
        .isLength({ min: 6, max: 25 })
        .withMessage('El nombre debe tener entre 6 y 25 caracteres'),
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido'),
    body('phone')
        .isMobilePhone()
        .withMessage('Debe ser un número de teléfono válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),
    handleValidationErrors
];

const validateAppointment = [
    body('dentistId')
        .isInt({ min: 1 })
        .withMessage('ID de dentista inválido'),
    body('appointmentDate')
        .isISO8601()
        .withMessage('Fecha de cita inválida'),
    handleValidationErrors
];

module.exports = {
    validateUserRegistration,
    validateAppointment,
    handleValidationErrors
};
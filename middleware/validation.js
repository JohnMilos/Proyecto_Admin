const { body, validationResult } = require('express-validator');

/**
 * Maneja los errores de validación y responde con formato JSON
 *
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Extraer solo los mensajes de error
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({
            success: false,
            message: 'Errores de validación en los datos proporcionados',
            errors: errorMessages
        });
    }

    next();
};

/**
 * Validaciones para el registro de usuarios
 * Aplica todas las reglas de negocio para nuevos usuarios
 */
const validateUserRegistration = [
    // Validar nombre (6-25 caracteres)
    body('name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 6, max: 25 })
        .withMessage('El nombre debe tener entre 6 y 25 caracteres')
        .trim()
        .escape(),

    // Validar email (formato válido y normalizado)
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('El email no puede exceder 100 caracteres'),

    // Validar teléfono (mínimo 10 dígitos)
    body('phone')
        .notEmpty()
        .withMessage('El teléfono es requerido')
        .isMobilePhone('any')
        .withMessage('Debe proporcionar un número de teléfono válido')
        .isLength({ min: 10 })
        .withMessage('El teléfono debe tener al menos 10 dígitos'),

    // Validar contraseña (fortaleza)
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'),

    // Validar rol (solo valores permitidos)
    body('role')
        .optional()
        .isIn(['patient', 'dentist', 'admin'])
        .withMessage('El rol debe ser patient, dentist o admin'),

    // Validar especialidad (requerida solo para dentistas)
    body('specialty')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('La especialidad debe tener entre 2 y 50 caracteres')
        .trim()
        .escape(),

    // Manejar los errores de validación
    handleValidationErrors
];

/**
 * Validaciones para la creación de citas
 * Aplica reglas para fechas, dentistas, etc.
 */
const validateAppointment = [
    // Validar ID del dentista (número entero positivo)
    body('dentistId')
        .notEmpty()
        .withMessage('El ID del dentista es requerido')
        .isInt({ min: 1 })
        .withMessage('El ID del dentista debe ser un número válido'),

    // Validar fecha y hora de la cita (formato ISO)
    body('date')
        .notEmpty()
        .withMessage('La fecha y hora de la cita son requeridas')
        .isISO8601()
        //.withMessage('La fecha debe estar en formato ISO (YYYY-MM-DDTHH:mm:ss)')
        .custom((value) => {
            const appointmentDate = new Date(value);
            const now = new Date();

            // Verificar que la cita no sea en el pasado
            if (appointmentDate <= now) {
                throw new Error('La cita debe ser programada para una fecha futura');
            }

            // Verificar que no sea más de 3 meses en el futuro
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

            if (appointmentDate > threeMonthsFromNow) {
                throw new Error('La cita no puede ser programada con más de 3 meses de anticipación');
            }

            return true;
        }),

    // Validar tipo de cita (valores permitidos)
    body('type')
        .optional()
        .isIn(['first_visit', 'follow_up', 'emergency', 'cleaning', 'treatment'])
        .withMessage('El tipo de cita debe ser first_visit, follow_up, emergency, cleaning o treatment'),

    // Validar notas (longitud máxima)
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Las notas no pueden exceder 500 caracteres')
        .trim()
        .escape(),

    // Manejar los errores de validación
    handleValidationErrors
];

/**
 * Validaciones para el login de usuarios
 */
const validateLogin = [
    // Validar email
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),

    // Validar contraseña
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida'),

    // Manejar los errores de validación
    handleValidationErrors
];

/**
 * Validaciones para reagendar citas
 */
const validateReschedule = [
    // Validar nueva fecha y hora
    body('newAppointmentDate')
        .notEmpty()
        .withMessage('La nueva fecha y hora son requeridas')
        .isISO8601()
        .withMessage('La nueva fecha debe estar en formato ISO (YYYY-MM-DDTHH:mm:ss)')
        .custom((value) => {
            const newDate = new Date(value);
            const now = new Date();

            if (newDate <= now) {
                throw new Error('La nueva cita debe ser programada para una fecha futura');
            }

            return true;
        }),

    // Manejar los errores de validación
    handleValidationErrors
];

// Exportar todos los validadores
module.exports = {
    validateUserRegistration,
    validateAppointment,
    validateLogin,
    validateReschedule,
    handleValidationErrors
};
const { body, param, validationResult } = require('express-validator');

// Common validation rules
const commonValidations = {
    clientId: param('id')
        .isMongoId()
        .withMessage('Invalid client ID format'),
    
    email: body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    password: body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    name: body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    phone: body('phone')
        .optional()
        .matches(/^\+?[\d\s-]{10,}$/)
        .withMessage('Invalid phone number format'),
    
    age: body('age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150'),
};

// Validation schemas for different routes
const validationSchemas = {
    createClient: [
        commonValidations.name,
        commonValidations.email,
        commonValidations.phone,
        commonValidations.age,
        body('goal')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Goal description too long'),
        body('coachId')
            .isMongoId()
            .withMessage('Invalid coach ID format')
    ],

    updateClient: [
        commonValidations.clientId,
        body('progress')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Progress description too long'),
        body('weight')
            .optional()
            .isFloat({ min: 0, max: 500 })
            .withMessage('Invalid weight value'),
        body('bmi')
            .optional()
            .isFloat({ min: 0, max: 100 })
            .withMessage('Invalid BMI value')
    ],

    scheduleSession: [
        commonValidations.clientId,
        body('date')
            .isISO8601()
            .withMessage('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)'),
        body('time')
            .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('Invalid time format. Use HH:MM format'),
        body('sessionType')
            .isIn(['Consultation', 'Follow-up'])
            .withMessage('Invalid session type')
    ],

    login: [
        commonValidations.email,
        commonValidations.password
    ],

    register: [
        commonValidations.name,
        commonValidations.email,
        commonValidations.password,
        body('role')
            .isIn(['admin', 'coach'])
            .withMessage('Invalid role')
    ]
};

// Validation result handler
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

module.exports = {
    validationSchemas,
    handleValidation
};
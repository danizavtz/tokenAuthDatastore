const { body, param, validationResult } = require('express-validator');

exports.validationBodyRules = [    
    body('name', 'name is required').exists(),
    body('login', 'login is required').exists(),
    body('password', 'password is required').exists(),
    body('name', 'name is required').notEmpty(),
    body('login', 'login is required').notEmpty(),
    body('password', 'password is required').notEmpty()
];

exports.validationGetRules = [
    param('id', 'id is required').exists(),
    param('id', 'id must be an integer with 16 positions').isLength({ min: 16, max: 16 }).isInt()
]

exports.validationPutRules = [
    body('name', 'name is required').exists(),
    body('name', 'name is required').notEmpty()
]

exports.checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    next()
}
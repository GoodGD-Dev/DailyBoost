const { body, param, query } = require('express-validator');

const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID do usuário deve ser válido')
];

const usersListValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número maior que 0'),
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Busca deve ter no máximo 100 caracteres')
    .trim()
    .escape(),
  query('filter')
    .optional()
    .isIn(['all', 'admin', 'regular', 'pending'])
    .withMessage('Filtro deve ser: all, admin, regular ou pending')
];

const adminLoginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 1 })
    .withMessage('Senha não pode estar vazia')
];

const adminForgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
    .trim()
];

module.exports = {
  userIdValidation,
  usersListValidation,
  adminLoginValidation,
  adminForgotPasswordValidation
};
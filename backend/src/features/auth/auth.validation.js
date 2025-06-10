const { body, param } = require('express-validator');

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
    .trim()
];

const completeRegisterValidation = [
  param('token')
    .notEmpty()
    .withMessage('Token é obrigatório')
    .isLength({ min: 64, max: 64 })
    .withMessage('Token deve ter 64 caracteres'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres')
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número')
];

const loginValidation = [
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

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
    .trim()
];

const resetPasswordValidation = [
  param('token')
    .notEmpty()
    .withMessage('Token é obrigatório')
    .isLength({ min: 40, max: 40 })
    .withMessage('Token deve ter 40 caracteres'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres')
    .trim()
    .escape()
];

module.exports = {
  registerValidation,
  completeRegisterValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation
};
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { redirectIfLoggedIn } = require('./middlewares');
const { adminLoginValidation, adminForgotPasswordValidation } = require('./admin.validation');
const { checkValidationErrors } = require('../../shared/utils/validation.utils');

/**
 * Rotas de autenticação do admin
 */

// Login
router.get('/login', redirectIfLoggedIn, authController.showLogin);
router.post('/login',
  redirectIfLoggedIn,
  adminLoginValidation,
  checkValidationErrors,
  authController.processLogin
);

// Logout
router.post('/logout', authController.logout);

// Recuperação de senha
router.get('/forgot-password', redirectIfLoggedIn, authController.showForgotPassword);
router.post('/forgot-password',
  redirectIfLoggedIn,
  adminForgotPasswordValidation,
  checkValidationErrors,
  authController.processForgotPassword
);

module.exports = router;
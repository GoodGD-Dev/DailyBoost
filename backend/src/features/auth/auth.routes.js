const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect, adminOnly } = require('./middlewares');
const {
  registerValidation,
  completeRegisterValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('./auth.validation');
const { checkValidationErrors } = require('../../shared/utils/validation.utils');

/**
 * ROTAS PÚBLICAS
 * Estas rotas são acessíveis sem autenticação
 */

// Rota para iniciar registro (solicita apenas email)
router.post('/start-register',
  registerValidation,
  checkValidationErrors,
  authController.startRegister
);

// Rota para completar registro (nome e senha com token)
router.post('/complete-register/:token',
  completeRegisterValidation,
  checkValidationErrors,
  authController.completeRegister
);

// Rota para login tradicional (email/senha)
router.post('/login',
  loginValidation,
  checkValidationErrors,
  authController.login
);

// Rota para login com Google (OAuth)
router.post('/google', authController.googleLogin);

// Rota para solicitar recuperação de senha (envia email)
router.post('/forgot-password',
  forgotPasswordValidation,
  checkValidationErrors,
  authController.forgotPassword
);

// Rota para redefinir a senha usando o token recebido por email
router.put('/reset-password/:token',
  resetPasswordValidation,
  checkValidationErrors,
  authController.resetPassword
);

/**
 * ROTAS PRIVADAS
 * Estas rotas requerem autenticação
 * O middleware 'protect' é executado antes do controlador
 */

// Rota para obter dados do usuário atual
router.get('/me', protect, authController.getMe);

// Rota para atualizar perfil do usuário
router.put('/me', protect, authController.updateProfile);

// Rota para realizar logout
router.post('/logout', protect, authController.logout);

/**
 * ROTAS ADMINISTRATIVAS
 * Estas rotas são para gerenciamento interno do sistema
 * Requerem autenticação + permissão de administrador
 */

// Rota para executar limpeza manual de registros expirados
router.post('/admin/cleanup', protect, adminOnly, authController.adminCleanup);

// Rota para verificar status do scheduler de Auth
router.get('/admin/scheduler/status', protect, adminOnly, authController.adminSchedulerStatus);

// Rota para parar o scheduler de Auth
router.post('/admin/scheduler/stop', protect, adminOnly, authController.adminSchedulerStop);

// Rota para reiniciar o scheduler de Auth
router.post('/admin/scheduler/restart', protect, adminOnly, authController.adminSchedulerRestart);

module.exports = router;
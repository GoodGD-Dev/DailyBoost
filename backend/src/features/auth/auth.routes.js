const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect, adminOnly } = require('./middlewares');

/**
 * ROTAS PÚBLICAS
 * Estas rotas são acessíveis sem autenticação
 */

// Rota para iniciar registro (solicita apenas email)
// POST /api/auth/start-register
router.post('/start-register', authController.startRegister);

// Rota para completar registro (nome e senha com token)
// POST /api/auth/complete-register/:token
router.post('/complete-register/:token', authController.completeRegister);

// Rota para login tradicional (email/senha)
// POST /api/auth/login
router.post('/login', authController.login);

// Rota para login com Google (OAuth)
// POST /api/auth/google
router.post('/google', authController.googleLogin);

// Rota para solicitar recuperação de senha (envia email)
// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// Rota para redefinir a senha usando o token recebido por email
// PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', authController.resetPassword);

/**
 * ROTAS PRIVADAS
 * Estas rotas requerem autenticação
 * O middleware 'protect' é executado antes do controlador
 */

// Rota para obter dados do usuário atual
// GET /api/auth/me
router.get('/me', protect, authController.getMe);

// Rota para realizar logout
// GET /api/auth/logout
router.get('/logout', protect, authController.logout);

/**
 * ROTAS ADMINISTRATIVAS
 * Estas rotas são para gerenciamento interno do sistema
 * Requerem autenticação + permissão de administrador
 */

// Rota para executar limpeza manual de registros expirados
// POST /api/auth/admin/cleanup
router.post('/admin/cleanup', protect, adminOnly, authController.adminCleanup);

// Rota para verificar status do scheduler de Auth
// GET /api/auth/admin/scheduler/status
router.get('/admin/scheduler/status', protect, adminOnly, authController.adminSchedulerStatus);

// Rota para parar o scheduler de Auth
// POST /api/auth/admin/scheduler/stop
router.post('/admin/scheduler/stop', protect, adminOnly, authController.adminSchedulerStop);

// Rota para reiniciar o scheduler de Auth
// POST /api/auth/admin/scheduler/restart
router.post('/admin/scheduler/restart', protect, adminOnly, authController.adminSchedulerRestart);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect } = require('./auth.middleware');

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
 * ROTAS PROTEGIDAS
 * Estas rotas requerem autenticação
 * O middleware 'protect' é executado antes do controlador
 */

// Rota para obter dados do usuário atual
// GET /api/auth/me
router.get('/me', protect, authController.getMe);

// Rota para realizar logout
// GET /api/auth/logout
router.get('/logout', protect, authController.logout);

module.exports = router;
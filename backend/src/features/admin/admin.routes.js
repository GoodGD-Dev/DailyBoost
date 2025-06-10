const express = require('express');
const router = express.Router();

// Importar controller e middlewares
const adminController = require('./admin.controller');
const { requireAdminSession, loadAdminUser } = require('./middlewares');

// Middleware para todas as rotas admin
router.use(loadAdminUser);
router.use(requireAdminSession);

// Dashboard principal
router.get('/dashboard', adminController.dashboard);

// Gerenciamento de usuários
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetail);
router.post('/users/:id/toggle-admin', adminController.toggleUserAdmin);
router.post('/users/:id/delete', adminController.deleteUser);

// Operações administrativas
router.post('/cleanup', adminController.runCleanup);

// Status do sistema
router.get('/system', adminController.systemStatus);

module.exports = router;
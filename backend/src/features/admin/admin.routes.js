const express = require('express');
const router = express.Router();
const User = require('../auth/auth.model');
const { requireAdminSession, loadAdminUser } = require('./middlewares/admin-auth.middleware');

// Middleware para todas as rotas admin - carregar dados do usuário e verificar sessão
router.use(loadAdminUser);
router.use(requireAdminSession);

// Dashboard principal
// GET /admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      adminUsers: await User.countDocuments({ isAdmin: true }),
      regularUsers: await User.countDocuments({ isAdmin: false }),
      pendingRegistrations: await User.countDocuments({
        registrationToken: { $exists: true }
      }),
      completedRegistrations: await User.countDocuments({
        name: { $exists: true },
        password: { $exists: true }
      }),
      recentUsers: await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name email isAdmin createdAt')
    };

    res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      stats,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    req.flash('error', 'Erro ao carregar dashboard');
    res.redirect('/');
  }
});

// Listar usuários com paginação e filtros
// GET /admin/users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';

    // Construir query de filtro
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (filter === 'admin') query.isAdmin = true;
    if (filter === 'regular') query.isAdmin = false;
    if (filter === 'pending') query.registrationToken = { $exists: true };

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name email isAdmin role createdAt registrationToken');

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render('admin/users', {
      title: 'Gerenciar Usuários',
      users,
      currentPage: page,
      totalPages,
      search,
      filter,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    req.flash('error', 'Erro ao carregar usuários');
    res.redirect('/admin/dashboard');
  }
});

// Visualizar usuário específico
// GET /admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      req.flash('error', 'Usuário não encontrado');
      return res.redirect('/admin/users');
    }

    res.render('admin/user-detail', {
      title: `Usuário: ${targetUser.name || targetUser.email}`,
      targetUser,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    req.flash('error', 'Erro ao carregar usuário');
    res.redirect('/admin/users');
  }
});

// Promover/rebaixar usuário
// POST /admin/users/:id/toggle-admin
router.post('/users/:id/toggle-admin', async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      req.flash('error', 'Usuário não encontrado');
      return res.redirect('/admin/users');
    }

    // Não permitir rebaixar o próprio usuário
    if (targetUser._id.toString() === req.user._id.toString()) {
      req.flash('error', 'Você não pode alterar suas próprias permissões');
      return res.redirect(`/admin/users/${targetUser._id}`);
    }

    targetUser.isAdmin = !targetUser.isAdmin;
    targetUser.role = targetUser.isAdmin ? 'admin' : 'user';
    await targetUser.save();

    const action = targetUser.isAdmin ? 'promovido a' : 'rebaixado de';
    req.flash('success', `Usuário ${action} administrador com sucesso`);
    res.redirect(`/admin/users/${targetUser._id}`);
  } catch (error) {
    req.flash('error', 'Erro ao alterar permissões do usuário');
    res.redirect('/admin/users');
  }
});

// Deletar usuário
// POST /admin/users/:id/delete
router.post('/users/:id/delete', async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      req.flash('error', 'Usuário não encontrado');
      return res.redirect('/admin/users');
    }

    // Não permitir deletar o próprio usuário
    if (targetUser._id.toString() === req.user._id.toString()) {
      req.flash('error', 'Você não pode deletar sua própria conta');
      return res.redirect(`/admin/users/${targetUser._id}`);
    }

    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'Usuário deletado com sucesso');
    res.redirect('/admin/users');
  } catch (error) {
    req.flash('error', 'Erro ao deletar usuário');
    res.redirect('/admin/users');
  }
});

// Executar limpeza manual
// POST /admin/cleanup
router.post('/cleanup', async (req, res) => {
  try {
    const { AuthScheduler } = require('../features/Auth/jobs');
    const result = await AuthScheduler.runManualCleanup();

    req.flash('success', `Limpeza executada com sucesso! ${result.deletedCount} registros removidos`);
  } catch (error) {
    req.flash('error', 'Erro ao executar limpeza: ' + error.message);
  }
  res.redirect('/admin/dashboard');
});

// Status do sistema
// GET /admin/system
router.get('/system', async (req, res) => {
  try {
    const { GlobalScheduler } = require('../schedulers');
    const systemStats = {
      schedulerStatus: GlobalScheduler.getStatus(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    };

    res.render('admin/system', {
      title: 'Status do Sistema',
      systemStats,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    req.flash('error', 'Erro ao carregar status do sistema');
    res.redirect('/admin');
  }
});

module.exports = router;
const AdminService = require('./admin.service');

/**
 * Dashboard principal
 * GET /admin/dashboard
 */
exports.dashboard = async (req, res) => {
  try {
    const stats = await AdminService.getDashboardStats();

    res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      stats,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    req.flash('error', 'Erro ao carregar dashboard');
    res.redirect('/admin/login');
  }
};

/**
 * Listar usuários com paginação e filtros
 * GET /admin/users
 */
exports.listUsers = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: 20,
      search: req.query.search || '',
      filter: req.query.filter || 'all'
    };

    const result = await AdminService.getUsers(filters);

    res.render('admin/users', {
      title: 'Gerenciar Usuários',
      users: result.users,
      pagination: result.pagination,
      search: result.filters.search,
      filter: result.filters.filter,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    req.flash('error', 'Erro ao carregar usuários');
    res.redirect('/admin/dashboard');
  }
};

/**
 * Visualizar usuário específico
 * GET /admin/users/:id
 */
exports.getUserDetail = async (req, res) => {
  try {
    const targetUser = await AdminService.getUserById(req.params.id);

    res.render('admin/user-detail', {
      title: `Usuário: ${targetUser.name || targetUser.email}`,
      targetUser,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    req.flash('error', error.message);
    res.redirect('/admin/users');
  }
};

/**
 * Promover/rebaixar usuário
 * POST /admin/users/:id/toggle-admin
 */
exports.toggleUserAdmin = async (req, res) => {
  try {
    const result = await AdminService.toggleUserAdmin(req.params.id, req.user._id);

    req.flash('success', `Usuário ${result.action} administrador com sucesso`);
    res.redirect(`/admin/users/${req.params.id}`);
  } catch (error) {
    console.error('Erro ao alterar permissões:', error);
    req.flash('error', error.message);
    res.redirect(error.statusCode === 404 ? '/admin/users' : `/admin/users/${req.params.id}`);
  }
};

/**
 * Deletar usuário
 * POST /admin/users/:id/delete
 */
exports.deleteUser = async (req, res) => {
  try {
    await AdminService.deleteUser(req.params.id, req.user._id);

    req.flash('success', 'Usuário deletado com sucesso');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    req.flash('error', error.message);
    res.redirect(error.statusCode === 404 ? '/admin/users' : `/admin/users/${req.params.id}`);
  }
};

/**
 * Executar limpeza manual
 * POST /admin/cleanup
 */
exports.runCleanup = async (req, res) => {
  try {
    // Importar aqui para evitar dependência circular
    const { AuthScheduler } = require('../auth/jobs');
    const result = await AuthScheduler.runManualCleanup();

    req.flash('success', `Limpeza executada com sucesso! ${result.deletedCount} registros removidos`);
  } catch (error) {
    console.error('Erro ao executar limpeza:', error);
    req.flash('error', 'Erro ao executar limpeza: ' + error.message);
  }
  res.redirect('/admin/dashboard');
};

/**
 * Status do sistema
 * GET /admin/system
 */
exports.systemStatus = async (req, res) => {
  try {
    // Importar aqui para evitar dependência circular
    const GlobalScheduler = require('../../schedulers');

    const systemStats = {
      ...AdminService.getSystemStats(),
      schedulerStatus: GlobalScheduler.getStatus()
    };

    res.render('admin/system', {
      title: 'Status do Sistema',
      systemStats,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Erro ao carregar status do sistema:', error);
    req.flash('error', 'Erro ao carregar status do sistema');
    res.redirect('/admin/dashboard');
  }
};
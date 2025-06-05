const User = require('../../auth/auth.model');

/**
 * Middleware para verificar se o admin está logado via sessão
 * Diferente do JWT - usa sessão específica para o painel admin
 */
exports.requireAdminSession = (req, res, next) => {
  // Verificar se existe sessão de admin
  if (!req.session || !req.session.adminUser) {
    return res.redirect('/admin/login');
  }

  // Anexar usuário admin à requisição
  req.user = req.session.adminUser;
  next();
};

/**
 * Middleware para redirecionar admin já logado
 * Se já estiver logado, redireciona para o dashboard
 */
exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.adminUser) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

/**
 * Middleware para carregar dados do usuário admin da sessão
 * Atualiza os dados do usuário a cada requisição
 */
exports.loadAdminUser = async (req, res, next) => {
  if (req.session && req.session.adminUser) {
    try {
      // Buscar dados atualizados do usuário
      const user = await User.findById(req.session.adminUser._id);

      if (!user || !user.isAdmin) {
        // Se usuário não existe mais ou não é mais admin, destroy session
        req.session.destroy();
        return res.redirect('/admin/login');
      }

      // Atualizar dados na sessão
      req.session.adminUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      };

      req.user = req.session.adminUser;
    } catch (error) {
      console.error('Erro ao carregar usuário admin:', error);
      req.session.destroy();
      return res.redirect('/admin/login');
    }
  }

  next();
};
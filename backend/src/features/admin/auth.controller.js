const User = require('../auth/auth.model');

/**
 * Página de login do admin
 * GET /admin/login
 */
exports.showLogin = (req, res) => {
  res.render('login', {
    title: 'Login Admin',
    error: null,
    messages: req.flash()
  });
};

/**
 * Processar login do admin
 * POST /admin/login
 */
exports.processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obrigatórios
    if (!email || !password) {
      return res.render('login', {
        title: 'Login Admin',
        error: 'Email e senha são obrigatórios',
        email // Manter email preenchido
      });
    }

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+password');

    // Verificar se usuário existe e senha está correta
    if (!user || !await user.matchPassword(password)) {
      return res.render('login', {
        title: 'Login Admin',
        error: 'Email ou senha incorretos',
        email
      });
    }

    // Verificar se é administrador
    if (!user.isAdmin) {
      return res.render('login', {
        title: 'Login Admin',
        error: 'Acesso negado. Apenas administradores.',
        email
      });
    }

    // Verificar se completou o registro
    if (!user.name || !user.password) {
      return res.render('login', {
        title: 'Login Admin',
        error: 'Complete seu registro antes de acessar o painel admin',
        email
      });
    }

    // Criar sessão do admin
    req.session.adminUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    };

    // Atualizar último login
    user.lastLoginAt = new Date();
    await user.save();

    // Log de acesso
    console.log(`✅ Admin login: ${user.email} acessou o painel`);

    // Redirecionar para dashboard
    res.redirect('/admin/dashboard');

  } catch (error) {
    console.error('Erro no login admin:', error);
    res.render('login', {
      title: 'Login Admin',
      error: 'Erro interno do servidor. Tente novamente.',
      email: req.body.email
    });
  }
};

/**
 * Logout do admin
 * POST /admin/logout
 */
exports.logout = (req, res) => {
  const userEmail = req.session?.adminUser?.email;

  // Destruir sessão
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.redirect('/admin/dashboard');
    }

    // Log de logout
    if (userEmail) {
      console.log(`👋 Admin logout: ${userEmail} saiu do painel`);
    }

    // Redirecionar para login
    res.redirect('/admin/login');
  });
};

/**
 * Página de recuperação de senha
 * GET /admin/forgot-password
 */
exports.showForgotPassword = (req, res) => {
  res.render('forgot-password', {
    title: 'Recuperar Senha Admin',
    error: null,
    success: null
  });
};

/**
 * Processar recuperação de senha
 * POST /admin/forgot-password
 */
exports.processForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.render('forgot-password', {
        title: 'Recuperar Senha Admin',
        error: 'Email é obrigatório'
      });
    }

    const user = await User.findOne({ email, isAdmin: true });

    if (!user) {
      return res.render('forgot-password', {
        title: 'Recuperar Senha Admin',
        error: 'Nenhum administrador encontrado com este email'
      });
    }

    // Aqui você pode implementar envio de email usando o authService
    try {
      const authService = require('../auth/auth.service');
      await authService.forgotUserPassword(email);

      res.render('forgot-password', {
        title: 'Recuperar Senha Admin',
        success: 'Instruções enviadas para seu email'
      });
    } catch (serviceError) {
      res.render('forgot-password', {
        title: 'Recuperar Senha Admin',
        error: serviceError.message
      });
    }

  } catch (error) {
    console.error('Erro no forgot password admin:', error);
    res.render('forgot-password', {
      title: 'Recuperar Senha Admin',
      error: 'Erro interno do servidor'
    });
  }
};
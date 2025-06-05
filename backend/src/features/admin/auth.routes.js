const express = require('express');
const router = express.Router();
const User = require('../auth/auth.model');
const { redirectIfLoggedIn } = require('./middlewares/admin-auth.middleware');

/**
 * Página de login do admin
 * GET /admin/login
 */
router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('login', {
    title: 'Login Admin',
    error: null,
    messages: req.flash()
  });
});

/**
 * Processar login do admin
 * POST /admin/login
 */
router.post('/login', redirectIfLoggedIn, async (req, res) => {
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

    // Verificar se usuário existe, senha está correta E é admin
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
});

/**
 * Logout do admin
 * POST /admin/logout
 */
router.post('/logout', (req, res) => {
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
});

/**
 * Rota para resetar senha do admin (opcional)
 * GET /admin/forgot-password
 */
router.get('/forgot-password', redirectIfLoggedIn, (req, res) => {
  res.render('forgot-password', {
    title: 'Recuperar Senha Admin',
    error: null,
    success: null
  });
});

/**
 * Processar reset de senha do admin
 * POST /admin/forgot-password
 */
router.post('/forgot-password', redirectIfLoggedIn, async (req, res) => {
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

    // Aqui você pode implementar envio de email
    // Por enquanto, apenas mostrar mensagem
    res.render('forgot-password', {
      title: 'Recuperar Senha Admin',
      success: 'Instruções enviadas para seu email (funcionalidade em desenvolvimento)'
    });

  } catch (error) {
    console.error('Erro no forgot password admin:', error);
    res.render('forgot-password', {
      title: 'Recuperar Senha Admin',
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
const authService = require('./auth.service');
const { sendTokenResponse } = require('./utils/jwt.utils');
const { AuthScheduler } = require('./jobs');

/**
 * @desc Iniciar processo de registro - solicita apenas email
 * @route POST /api/auth/start-register
 * @access Public
 */
exports.startRegister = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error('Por favor, forneça um email');
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.startUserRegistration(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Completar registro com nome e senha
 * @route POST /api/auth/complete-register/:token
 * @access Public
 */
exports.completeRegister = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    if (!name || !password) {
      const error = new Error('Por favor, forneça nome e senha');
      error.statusCode = 400;
      throw error;
    }

    const user = await authService.completeUserRegistration(token, { name, password });
    // Envia token JWT para login automático após completar o registro
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Login do usuário
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email e senha são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    const user = await authService.loginUser({ email, password });
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Login com Google
 * @route POST /api/auth/google
 * @access Public
 */
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      const error = new Error('Token do Google é obrigatório');
      error.statusCode = 400;
      throw error;
    }

    const user = await authService.googleLoginUser(idToken);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Esqueci a senha
 * @route POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error('Email é obrigatório');
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.forgotUserPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Redefinir senha
 * @route PUT /api/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      const error = new Error('Nova senha é obrigatória');
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.resetUserPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Obter usuário atual
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Atualizar perfil do usuário
 * @route PUT /api/auth/me
 * @access Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await authService.updateUserProfile(req.user.id, { name });

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Logout
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};

// ============ ROTAS ADMINISTRATIVAS ============

/**
 * @desc Executar limpeza manual de registros expirados
 * @route POST /api/auth/admin/cleanup
 * @access Admin
 */
exports.adminCleanup = async (req, res, next) => {
  try {
    const result = await AuthScheduler.runManualCleanup();
    res.status(200).json({
      success: true,
      message: 'Limpeza de Auth executada com sucesso',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verificar status do scheduler de Auth
 * @route GET /api/auth/admin/scheduler/status
 * @access Admin
 */
exports.adminSchedulerStatus = (req, res) => {
  try {
    const status = AuthScheduler.getStatus();
    res.status(200).json({
      success: true,
      scheduler: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter status do scheduler',
      error: error.message
    });
  }
};

/**
 * @desc Parar scheduler de Auth
 * @route POST /api/auth/admin/scheduler/stop
 * @access Admin
 */
exports.adminSchedulerStop = (req, res) => {
  try {
    AuthScheduler.stop();
    res.status(200).json({
      success: true,
      message: 'Scheduler de Auth parado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao parar scheduler de Auth',
      error: error.message
    });
  }
};

/**
 * @desc Reiniciar scheduler de Auth
 * @route POST /api/auth/admin/scheduler/restart
 * @access Admin
 */
exports.adminSchedulerRestart = (req, res) => {
  try {
    AuthScheduler.restart();
    res.status(200).json({
      success: true,
      message: 'Scheduler de Auth reiniciado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao reiniciar scheduler de Auth',
      error: error.message
    });
  }
};
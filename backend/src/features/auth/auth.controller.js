const authService = require('./auth.service');
const { sendTokenResponse } = require('../../utils/jwt.utils');

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
    const user = await authService.loginUser(req.body);
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
 * @desc Logout
 * @route GET /api/auth/logout
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
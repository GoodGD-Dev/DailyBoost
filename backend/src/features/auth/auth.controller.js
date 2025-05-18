const authService = require('./auth.service');
const { sendTokenResponse } = require('../../utils/jwt.utils');

/**
 * @desc    Registrar um novo usuário
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verificar email do usuário
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { user, alreadyVerified } = await authService.verifyUserEmail(token);

    // Enviar token JWT para login automático
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login do usuário
 * @route   POST /api/auth/login
 * @access  Public
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
 * @desc    Login com Google
 * @route   POST /api/auth/google
 * @access  Public
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
 * @desc    Esqueci a senha
 * @route   POST /api/auth/forgot-password
 * @access  Public
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
 * @desc    Redefinir senha
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
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
 * @desc    Obter usuário atual
 * @route   GET /api/auth/me
 * @access  Private
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
 * @desc    Logout
 * @route   GET /api/auth/logout
 * @access  Private
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
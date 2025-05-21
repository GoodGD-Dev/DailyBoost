const authService = require('./auth.service');
const { sendTokenResponse } = require('../../utils/jwt.utils');

/**
 * @desc Registrar um novo usuário
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  try {
    // Chama o serviço de registro e passa os dados do corpo da requisição
    const result = await authService.registerUser(req.body);

    // Verifica se o resultado contém os dados do usuário
    if (result.user) {
      // Se existe o objeto user, envia um token JWT para autenticação automática
      // Código 201 indica que um recurso foi criado com sucesso
      return sendTokenResponse(result.user, 201, res);
    } else {
      // Se não existe o objeto user, apenas retorna a mensagem do resultado
      // Isso pode acontecer em cenários especiais, como quando é necessário verificar o email primeiro
      return res.status(201).json(result);
    }
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
    next(error);
  }
};

/**
 * @desc Reenviar email de verificação
 * @route POST /api/auth/resend-verification
 * @access Public
 */
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    // Extrai o email do corpo da requisição
    const { email } = req.body;
    // Chama o serviço para reenviar o email de verificação
    const result = await authService.resendVerificationEmail(email);

    // Retorna a resposta com status 200 (OK)
    res.status(200).json(result);
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
    next(error);
  }
};

/**
 * @desc Verificar email do usuário
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    // Extrai o token dos parâmetros da URL
    const { token } = req.params;

    // Chama o serviço para verificar o email usando o token
    // Desestrutura o resultado para obter o usuário e se já estava verificado
    const { user, alreadyVerified } = await authService.verifyUserEmail(token);

    // Envia token JWT para permitir login automático após verificação
    sendTokenResponse(user, 200, res);
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
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
    // Chama o serviço de login passando os dados da requisição (email/senha)
    const user = await authService.loginUser(req.body);

    // Gera e envia o token JWT para o cliente
    sendTokenResponse(user, 200, res);
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
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
    // Extrai o token de ID do Google do corpo da requisição
    const { idToken } = req.body;

    // Chama o serviço para autenticar com o Google
    const user = await authService.googleLoginUser(idToken);

    // Gera e envia o token JWT para o cliente
    sendTokenResponse(user, 200, res);
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
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
    // Extrai o email do corpo da requisição
    const { email } = req.body;

    // Chama o serviço para iniciar o processo de recuperação de senha
    const result = await authService.forgotUserPassword(email);

    // Retorna a resposta (geralmente uma mensagem de sucesso)
    res.status(200).json(result);
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
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
    // Extrai o token dos parâmetros da URL
    const { token } = req.params;

    // Extrai a nova senha do corpo da requisição
    const { password } = req.body;

    // Chama o serviço para redefinir a senha
    const result = await authService.resetUserPassword(token, password);

    // Retorna a resposta (geralmente uma mensagem de sucesso)
    res.status(200).json(result);
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
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
    // Obtém o ID do usuário a partir do objeto user anexado ao req
    const user = await authService.getCurrentUser(req.user.id);

    // Retorna os dados do usuário autenticado
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
    next(error);
  }
};

/**
 * @desc Logout
 * @route GET /api/auth/logout
 * @access Private
 */
exports.logout = (req, res) => {
  // Define o cookie do token como 'none' e configura para expirar em 10 segundos
  // Isso efetivamente invalida o token JWT armazenado em cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 segundos
    httpOnly: true // Cookie acessível apenas pelo servidor, não por JavaScript
  });

  // Retorna uma mensagem de sucesso
  res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};
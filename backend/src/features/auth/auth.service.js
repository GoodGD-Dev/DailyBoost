const crypto = require('crypto');
const User = require('./auth.model');
const { sendEmail } = require('../../utils/email.utils');
const { sendTokenResponse } = require('../../utils/jwt.utils');
const firebase = require('../../config/firebase');

/**
 * Função auxiliar para enviar email de verificação
 * Função privada usada internamente pelo serviço
 * 
 * @param {Object} user - Objeto do usuário
 * @param {string} token - Token de verificação
 */
const sendVerificationEmail = async (user, token) => {
  // Constrói a URL completa para verificação (frontend + token)
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  // Envia o email com um template HTML
  await sendEmail({
    to: user.email,
    subject: 'Confirme seu email',
    html: `
      <h1>Olá ${user.name},</h1>
      <p>Bem-vindo à nossa aplicação!</p>
      <p>Por favor, clique no link abaixo para verificar seu email:</p>
      <a href="${verificationUrl}" target="_blank">Verificar Email</a>
      <p>Este link expira em 24 horas.</p>
      <p>Atenciosamente,<br>Equipe Login App</p>
    `
  });
};

/**
 * Serviço para registro de usuário
 * Cria um novo usuário e envia email de verificação
 * 
 * @param {Object} userData - Dados do usuário (nome, email, senha)
 * @returns {Object} - Resposta com status e mensagem
 */
exports.registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Verificar se o usuário já existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Lança erro com código de status para ser capturado pelo controlador
    const error = new Error('Este email já está em uso');
    error.statusCode = 400;
    throw error;
  }

  // Criar token de verificação de email usando crypto
  // randomBytes gera bytes aleatórios seguros, convertidos para string hexadecimal
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  // Define a data de expiração para 24h a partir de agora
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  // Criar usuário no banco de dados
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken,
    emailVerificationExpires
  });

  // Enviar email de verificação usando a função auxiliar
  await sendVerificationEmail(user, emailVerificationToken);

  // Retorna objeto de sucesso com os dados do usuário
  return {
    success: true,
    message: 'Usuário registrado com sucesso. Por favor, verifique seu email para confirmar sua conta.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified
    }
  };
};

/**
 * Serviço para reenviar email de verificação
 * Usado quando o usuário não recebeu ou perdeu o email inicial
 * 
 * @param {string} email - Email do usuário
 * @returns {Object} - Resposta com status e mensagem
 */
exports.resendVerificationEmail = async (email) => {
  // Buscar usuário pelo email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Verificar se o email já foi verificado
  if (user.isEmailVerified) {
    return {
      success: true,
      message: 'Este email já foi verificado. Você pode fazer login normalmente.'
    };
  }

  // Gerar novo token de verificação
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  // Atualizar usuário com novo token
  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationExpires = emailVerificationExpires;
  await user.save();

  // Enviar novo email de verificação
  await sendVerificationEmail(user, emailVerificationToken);

  return {
    success: true,
    message: 'Um novo email de verificação foi enviado. Por favor, verifique sua caixa de entrada.'
  };
};

/**
 * Serviço para verificação de email
 * Valida o token de verificação e ativa a conta do usuário
 * 
 * @param {string} token - Token de verificação recebido do email
 * @returns {Object} - Objeto contendo usuário e status de verificação
 */
exports.verifyUserEmail = async (token) => {
  console.log(`Tentativa de verificação de email com token: ${token}`);

  // Buscar usuário com o token de verificação que ainda não expirou
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() } // $gt = greater than (maior que data atual)
  });

  if (!user) {
    // Verificar se é um usuário cujo email já foi verificado
    // Tratamento especial para evitar confusão quando o usuário tenta verificar novamente
    const verifiedUser = await User.findOne({
      emailVerificationToken: token,
      isEmailVerified: true
    });

    if (verifiedUser) {
      console.log(`Email já verificado para usuário: ${verifiedUser.email}`);
      return { user: verifiedUser, alreadyVerified: true };
    }

    const error = new Error('Token inválido ou expirado');
    error.statusCode = 400;
    throw error;
  }

  // Atualizar usuário - marcar como verificado e limpar os campos de token
  console.log(`Atualizando status de verificação para o usuário ${user.email}`);
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined; // Remove o token
  user.emailVerificationExpires = undefined; // Remove a data de expiração
  await user.save();
  console.log('Usuário atualizado com sucesso, email verificado');

  return { user, alreadyVerified: false };
};

/**
 * Serviço para login de usuário
 * Autentica o usuário com email e senha
 * 
 * @param {Object} credentials - Credenciais (email e senha)
 * @returns {Object} - Objeto do usuário autenticado
 */
exports.loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Verificar se o email e senha foram fornecidos
  if (!email || !password) {
    const error = new Error('Por favor, forneça email e senha');
    error.statusCode = 400;
    throw error;
  }

  // Verificar se o usuário existe
  // O select('+password') é necessário porque defini select: false no modelo
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Verificar se a senha está correta usando o método definido no modelo
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Retornar o usuário completo
  return user;
};

/**
 * Serviço para login com Google
 * Autentica ou registra o usuário usando credenciais do Google
 * 
 * @param {string} idToken - Token de ID do Firebase/Google
 * @returns {Object} - Objeto do usuário autenticado
 */
exports.googleLoginUser = async (idToken) => {
  try {
    // Verificar o token do Firebase
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    const { name, email, uid, email_verified } = decodedToken;

    // Verificar se o usuário já existe
    let user = await User.findOne({ email });

    if (!user) {
      // Criar um novo usuário se não existir
      // Note que não há senha - apenas googleId
      user = await User.create({
        name,
        email,
        googleId: uid,
        isEmailVerified: email_verified // Confia na verificação do Google
      });
    } else {
      // Atualizar o googleId se não existir (para vinculação de contas)
      if (!user.googleId) {
        user.googleId = uid;
        await user.save();
      }
    }

    return user;
  } catch (error) {
    console.error('Erro no login com Google:', error);
    throw error;
  }
};

/**
 * Serviço para recuperação de senha
 * Gera token e envia email para redefinição
 * 
 * @param {string} email - Email do usuário
 * @returns {Object} - Resposta com status e mensagem
 */
exports.forgotUserPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Não existe uma conta com este email');
    error.statusCode = 404;
    throw error;
  }

  // Gerar token de redefinição
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  // Enviar email com link de redefinição
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Redefinição de senha',
    html: `
      <h1>Olá ${user.name},</h1>
      <p>Você solicitou a redefinição de sua senha.</p>
      <p>Por favor, clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}" target="_blank">Redefinir Senha</a>
      <p>Este link expira em 1 hora.</p>
      <p>Se você não solicitou esta redefinição, ignore este email.</p>
      <p>Atenciosamente,<br>Equipe Login App</p>
    `
  });

  return {
    success: true,
    message: 'Email enviado com instruções para redefinir sua senha'
  };
};

/**
 * Serviço para redefinição de senha
 * Valida o token e atualiza a senha do usuário
 * 
 * @param {string} token - Token de redefinição
 * @param {string} password - Nova senha
 * @returns {Object} - Resposta com status e mensagem
 */
exports.resetUserPassword = async (token, password) => {
  // Buscar usuário com o token de redefinição válido (não expirado)
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Token inválido ou expirado');
    error.statusCode = 400;
    throw error;
  }

  // Definir nova senha e limpar campos de redefinição
  user.password = password; // Será criptografada pelo middleware pre-save
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return {
    success: true,
    message: 'Senha redefinida com sucesso'
  };
};

/**
 * Serviço para obter informações do usuário atual
 * Retorna dados do usuário logado
 * 
 * @param {string} userId - ID do usuário
 * @returns {Object} - Dados do usuário
 */
exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Retorna apenas os dados necessários (sem informações sensíveis)
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified
  };
};
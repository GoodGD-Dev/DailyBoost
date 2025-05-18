const crypto = require('crypto');
const User = require('./auth.model');
const { sendEmail } = require('../../utils/email.utils');
const { sendTokenResponse } = require('../../utils/jwt.utils');
const firebase = require('../../config/firebase');

/**
 * Serviço para registro de usuário
 */
exports.registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Verificar se o usuário já existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Este email já está em uso');
    error.statusCode = 400;
    throw error;
  }

  // Criar token de verificação de email
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  // Criar usuário
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken,
    emailVerificationExpires
  });

  // Enviar email de verificação
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;

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

  return {
    success: true,
    message: 'Usuário registrado com sucesso. Por favor, verifique seu email para confirmar sua conta.'
  };
};

/**
 * Serviço para verificação de email
 */
exports.verifyUserEmail = async (token) => {
  console.log(`Tentativa de verificação de email com token: ${token}`);

  // Buscar usuário com o token de verificação
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    // Verificar se é um usuário cujo email já foi verificado
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

  // Atualizar usuário
  console.log(`Atualizando status de verificação para o usuário ${user.email}`);
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  console.log('Usuário atualizado com sucesso, email verificado');

  return { user, alreadyVerified: false };
};

/**
 * Serviço para login de usuário
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
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Verificar se a senha está correta
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Verificar se o email foi confirmado
  if (!user.isEmailVerified) {
    const error = new Error('Por favor, verifique seu email antes de fazer login');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

/**
 * Serviço para login com Google
 */
exports.googleLoginUser = async (idToken) => {
  try {
    // Verificar o token do Firebase
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    const { name, email, uid, email_verified } = decodedToken;

    // Verificar se o usuário já existe
    let user = await User.findOne({ email });

    if (!user) {
      // Criar um novo usuário
      user = await User.create({
        name,
        email,
        googleId: uid,
        isEmailVerified: email_verified
      });
    } else {
      // Atualizar o googleId se não existir
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
 */
exports.forgotUserPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Não existe uma conta com este email');
    error.statusCode = 404;
    throw error;
  }

  // Gerar token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  // Enviar email
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
 */
exports.resetUserPassword = async (token, password) => {
  // Buscar usuário com o token de redefinição
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Token inválido ou expirado');
    error.statusCode = 400;
    throw error;
  }

  // Definir nova senha
  user.password = password;
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
 */
exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified
  };
};
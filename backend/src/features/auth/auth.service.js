const crypto = require('crypto');
const User = require('./auth.model');
const { sendEmail } = require('../../utils/email.utils');
const firebase = require('./config/firebase');

/**
 * Limpa registros expirados automaticamente
 * Deve ser executada periodicamente (cron job)
 */
exports.cleanupExpiredRegistrations = async () => {
  try {
    const result = await User.deleteMany({
      // Remove usuários que têm token expirado E não completaram o registro
      registrationTokenExpires: { $lt: Date.now() },
      $or: [
        { name: { $exists: false } },
        { name: null },
        { password: { $exists: false } },
        { password: null }
      ]
    });

    console.log(`🧹 Limpeza: ${result.deletedCount} registros expirados removidos`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Erro na limpeza automática:', error);
    throw error;
  }
};

/**
 * Função auxiliar para enviar email de continuação do registro
 * 
 * @param {string} email - Email do usuário
 * @param {string} token - Token de continuação do registro
 */
const sendRegistrationContinuationEmail = async (email, token) => {
  const continueUrl = `${process.env.FRONTEND_URL}/complete-register/${token}`;

  await sendEmail({
    to: email,
    subject: 'Complete seu registro',
    html: `
      <h1>Bem-vindo!</h1>
      <p>Você iniciou o processo de registro em nossa aplicação.</p>
      <p>Para completar seu cadastro, clique no link abaixo e defina seu nome e senha:</p>
      <a href="${continueUrl}" target="_blank" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Completar Registro</a>
      <p><strong>⏰ Este link expira em 24 horas.</strong></p>
      <p>Se você não solicitou este registro, ignore este email.</p>
      <p>Atenciosamente,<br>Equipe Login App</p>
    `
  });
};

/**
 * Serviço para iniciar o processo de registro
 * Agora com melhor tratamento de registros expirados
 * 
 * @param {string} email - Email do usuário
 * @returns {Object} - Resposta com status e mensagem
 */
exports.startUserRegistration = async (email) => {
  // Verificar se o usuário já existe e está completo
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.name && existingUser.password) {
    const error = new Error('Este email já está registrado. Faça login ou recupere sua senha.');
    error.statusCode = 400;
    throw error;
  }

  // Se existe um registro expirado, remove ele primeiro
  if (existingUser && existingUser.registrationTokenExpires && existingUser.registrationTokenExpires < Date.now()) {
    await User.deleteOne({ email });
    console.log(`🗑️ Registro expirado removido para: ${email}`);
  }

  // Gerar token de continuação do registro
  const registrationToken = crypto.randomBytes(32).toString('hex');
  const registrationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  if (existingUser && existingUser.registrationTokenExpires > Date.now()) {
    // Se o usuário existe e token ainda válido, atualiza o token
    existingUser.registrationToken = registrationToken;
    existingUser.registrationTokenExpires = registrationTokenExpires;
    await existingUser.save();
  } else {
    // Criar entrada temporária no banco com apenas email e tokens
    await User.create({
      email,
      registrationToken,
      registrationTokenExpires,
      isEmailVerified: true,
      createdAt: new Date() // Para tracking
    });
  }

  // Enviar email de continuação
  await sendRegistrationContinuationEmail(email, registrationToken);

  return {
    success: true,
    message: 'Enviamos um link para seu email para completar o registro. Verifique sua caixa de entrada.',
    expiresIn: '24 horas' // Info útil para o frontend
  };
};

/**
 * MELHORADO: Serviço para completar o registro
 * Agora com melhor feedback de erro
 * 
 * @param {string} token - Token de continuação do registro
 * @param {Object} userData - Dados do usuário (nome e senha)
 * @returns {Object} - Usuário completo registrado
 */
exports.completeUserRegistration = async (token, userData) => {
  const { name, password } = userData;

  // Buscar usuário com o token de registro válido (não expirado)
  const user = await User.findOne({
    registrationToken: token,
    registrationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    // MELHORADO: Verifica se existe token expirado para dar feedback específico
    const expiredUser = await User.findOne({ registrationToken: token });

    if (expiredUser) {
      const error = new Error('Link de registro expirado. Solicite um novo link.');
      error.statusCode = 410; // Gone
    } else {
      const error = new Error('Token inválido. Verifique o link ou solicite um novo.');
      error.statusCode = 400;
    }
    throw error;
  }

  // Verificar se o registro já foi completado
  if (user.name && user.password) {
    const error = new Error('Este registro já foi completado. Faça login normalmente.');
    error.statusCode = 400;
    throw error;
  }

  // Completar o registro
  user.name = name;
  user.password = password; // Será criptografada pelo middleware pre-save
  user.registrationToken = undefined; // Remove o token
  user.registrationTokenExpires = undefined; // Remove a data de expiração
  user.registrationCompletedAt = new Date(); // NOVO: Timestamp de quando foi completado
  await user.save();

  console.log(`✅ Registro completado para: ${user.email}`);

  return user;
};

// RESTO DOS MÉTODOS PERMANECEM IGUAIS...
// (loginUser, googleLoginUser, forgotUserPassword, resetUserPassword, getCurrentUser)

/**
 * Serviço para login de usuário
 * Autentica o usuário com email e senha
 * 
 * @param {Object} credentials - Credenciais (email e senha)
 * @returns {Object} - Objeto do usuário autenticado
 */
exports.loginUser = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    const error = new Error('Por favor, forneça email e senha');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Verificar se o usuário completou o registro
  if (!user.name || !user.password) {
    const error = new Error('Registro não completado. Complete seu registro primeiro.');
    error.statusCode = 401;
    throw error;
  }

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
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    const { name, email, uid, email_verified } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // Criar um novo usuário completo (Google fornece nome automaticamente)
      user = await User.create({
        name,
        email,
        googleId: uid,
        isEmailVerified: email_verified // Confia na verificação do Google
      });
    } else {
      // Atualizar o googleId se não existir
      if (!user.googleId) {
        user.googleId = uid;
        // Se for um registro incompleto, completar com dados do Google
        if (!user.name) {
          user.name = name;
        }
        user.isEmailVerified = email_verified;
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

  // Verificar se o usuário completou o registro
  if (!user.name || !user.password) {
    const error = new Error('Complete seu registro primeiro antes de redefinir a senha');
    error.statusCode = 400;
    throw error;
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

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
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Token inválido ou expirado');
    error.statusCode = 400;
    throw error;
  }

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

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified
  };
};
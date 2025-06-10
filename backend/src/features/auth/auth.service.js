const crypto = require('crypto');
const User = require('./auth.model');
const { sendEmail } = require('../../shared/utils/email.utils');
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
 */
const sendRegistrationContinuationEmail = async (email, token) => {
  const continueUrl = `${process.env.FRONTEND_URL}/complete-register/${token}`;

  await sendEmail({
    to: email,
    subject: 'Complete seu registro - ' + (process.env.APP_NAME || 'App'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Bem-vindo!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Complete seu registro</h2>
          <p style="color: #666; line-height: 1.6;">
            Você iniciou o processo de registro em nossa aplicação.
            Para completar seu cadastro, clique no botão abaixo e defina seu nome e senha:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${continueUrl}" 
               style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Completar Registro
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>⏰ Este link expira em 24 horas.</strong></p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Se você não solicitou este registro, ignore este email.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Atenciosamente,<br>Equipe ${process.env.APP_NAME || 'App'}</p>
        </div>
      </div>
    `
  });
};

/**
 * Serviço para iniciar o processo de registro
 * Agora com melhor tratamento de registros expirados
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
      createdAt: new Date()
    });
  }

  // Enviar email de continuação
  await sendRegistrationContinuationEmail(email, registrationToken);

  return {
    success: true,
    message: 'Enviamos um link para seu email para completar o registro. Verifique sua caixa de entrada.',
    expiresIn: '24 horas'
  };
};

/**
 * Serviço para completar o registro
 * Agora com melhor feedback de erro
 */
exports.completeUserRegistration = async (token, userData) => {
  const { name, password } = userData;

  // Buscar usuário com o token de registro válido (não expirado)
  const user = await User.findOne({
    registrationToken: token,
    registrationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    // Verifica se existe token expirado para dar feedback específico
    const expiredUser = await User.findOne({ registrationToken: token });

    if (expiredUser) {
      const error = new Error('Link de registro expirado. Solicite um novo link.');
      error.statusCode = 410; // Gone
      throw error;
    } else {
      const error = new Error('Token inválido. Verifique o link ou solicite um novo.');
      error.statusCode = 400;
      throw error;
    }
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
  user.registrationToken = undefined;
  user.registrationTokenExpires = undefined;
  user.registrationCompletedAt = new Date();
  user.lastLoginAt = new Date();
  await user.save();

  console.log(`✅ Registro completado para: ${user.email}`);

  return user;
};

/**
 * Serviço para login de usuário
 * Autentica o usuário com email e senha
 */
exports.loginUser = async (credentials) => {
  const { email, password } = credentials;

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

  // Verificar senha
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Atualizar último login
  user.lastLoginAt = new Date();
  await user.save();

  return user;
};

/**
 * Serviço para login com Google
 * Autentica ou registra o usuário usando credenciais do Google
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
        isEmailVerified: email_verified,
        registrationCompletedAt: new Date(),
        lastLoginAt: new Date()
      });
    } else {
      // Atualizar o googleId se não existir
      if (!user.googleId) {
        user.googleId = uid;
        // Se for um registro incompleto, completar com dados do Google
        if (!user.name) {
          user.name = name;
          user.registrationCompletedAt = new Date();
        }
        user.isEmailVerified = email_verified;
      }
      user.lastLoginAt = new Date();
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Erro no login com Google:', error);
    const authError = new Error('Erro na autenticação com Google');
    authError.statusCode = 401;
    throw authError;
  }
};

/**
 * Serviço para recuperação de senha
 * Gera token e envia email para redefinição
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
    subject: 'Redefinição de senha - ' + (process.env.APP_NAME || 'App'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Redefinir Senha</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Olá ${user.name},</h2>
          <p style="color: #666; line-height: 1.6;">
            Você solicitou a redefinição de sua senha.
            Por favor, clique no botão abaixo para redefinir sua senha:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Redefinir Senha
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>⏰ Este link expira em 1 hora.</strong></p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Se você não solicitou esta redefinição, ignore este email.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Atenciosamente,<br>Equipe ${process.env.APP_NAME || 'App'}</p>
        </div>
      </div>
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
 */
exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user.getPublicData();
};

/**
 * Serviço para atualizar perfil do usuário
 */
exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Campos permitidos para atualização
  const allowedFields = ['name'];

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();

  return user.getPublicData();
};
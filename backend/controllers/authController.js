const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const admin = require('../config/firebase');
const { sendEmail } = require('../utils/emailService');
const { sendTokenResponse } = require('../utils/jwtUtils');

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está em uso'
      });
    }

    // Criar token de verificação de email
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Criar usuário
    user = await User.create({
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

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso. Por favor, verifique seu email para confirmar sua conta.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verificar email do usuário
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
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
        // Enviar resposta com login automático
        return sendTokenResponse(verifiedUser, 200, res);
      }

      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Atualizar usuário
    console.log(`Atualizando status de verificação para o usuário ${user.email}`);
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    console.log('Usuário atualizado com sucesso, email verificado');

    // Enviar token JWT para login automático
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    next(error);
  }
};

// @desc    Login do usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha'
      });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se a senha está correta
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se o email foi confirmado
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Por favor, verifique seu email antes de fazer login'
      });
    }

    // Criar e enviar token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login com Google
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    // Verificar o token do Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
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

    // Criar e enviar token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Esqueci a senha
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Não existe uma conta com este email'
      });
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

    res.status(200).json({
      success: true,
      message: 'Email enviado com instruções para redefinir sua senha'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redefinir senha
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Buscar usuário com o token de redefinição
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Definir nova senha
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   GET /api/auth/logout
// @access  Private
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

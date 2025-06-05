const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Nome do usuário (opcional até completar registro)
  name: {
    type: String,
    required: function () {
      // Nome é obrigatório apenas se não for login do Google e se password existir
      return !this.googleId && this.password;
    }
  },
  // Email do usuário
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true,
    lowercase: true
  },
  // Senha do usuário (opcional até completar registro)
  password: {
    type: String,
    required: function () {
      // Senha é obrigatória apenas se não for login do Google e se name existir
      return !this.googleId && this.name;
    },
    minlength: 6,
    select: false
  },
  // ID do Google para autenticação OAuth
  googleId: {
    type: String
  },

  // ============ CAMPOS DE ADMINISTRAÇÃO ============

  // Flag para indicar se o usuário é administrador
  isAdmin: {
    type: Boolean,
    default: false
  },

  // Sistema de roles (opcional - use se preferir roles ao invés de booleano)
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },

  // ============ CAMPOS EXISTENTES ============

  // Token para continuação do registro (substitui emailVerificationToken)
  registrationToken: String,
  // Data de expiração do token de registro
  registrationTokenExpires: Date,
  // Data de quando o registro foi completado
  registrationCompletedAt: Date,
  // Token para redefinição de senha
  resetPasswordToken: String,
  // Data de expiração do token de redefinição de senha
  resetPasswordExpires: Date,
  // Data de criação da conta
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Middleware que é executado antes de salvar o documento
 * Criptografa a senha automaticamente quando é criada ou modificada
 */
UserSchema.pre('save', async function (next) {
  // Só criptografa se a senha foi modificada E existe
  if (!this.isModified('password') || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Método personalizado que verifica se a senha fornecida corresponde à senha armazenada
 * Usado no processo de login
 * 
 * @param {string} enteredPassword - Senha fornecida pelo usuário durante o login
 * @returns {boolean} - Verdadeiro se a senha corresponder, falso caso contrário
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Verifica se a senha existe antes de comparar
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Método para verificar se o usuário é administrador
 * @returns {boolean} - Verdadeiro se for admin
 */
UserSchema.methods.isAdministrator = function () {
  return this.isAdmin || this.role === 'admin' || this.role === 'superadmin';
};

/**
 * Método para verificar se o usuário é super administrador
 * @returns {boolean} - Verdadeiro se for super admin
 */
UserSchema.methods.isSuperAdmin = function () {
  return this.role === 'superadmin';
};

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Nome do usuário (opcional até completar registro)
  name: {
    type: String,
    required: function () {
      return !this.googleId && this.password;
    },
    trim: true,
    maxlength: [50, 'Nome não pode ter mais que 50 caracteres']
  },

  // Email do usuário
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true, // Index será criado automaticamente
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, informe um email válido'
    ]
  },

  // Senha do usuário (opcional até completar registro)
  password: {
    type: String,
    required: function () {
      return !this.googleId && this.name;
    },
    minlength: 6,
    select: false // Não incluir senha nas consultas por padrão
  },

  // ID do Google para autenticação OAuth
  googleId: {
    type: String,
    sparse: true, // Index será criado automaticamente
    unique: true
  },

  // ============ CAMPOS DE ADMINISTRAÇÃO ============
  // Flag para indicar se o usuário é administrador
  isAdmin: {
    type: Boolean,
    default: false
  },

  // Sistema de roles
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },

  // ============ CAMPOS DE VERIFICAÇÃO ============
  // Flag para indicar se o email foi verificado
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // Token para continuação do registro
  registrationToken: String,

  // Data de expiração do token de registro
  registrationTokenExpires: Date,

  // Data de quando o registro foi completado
  registrationCompletedAt: Date,

  // Token para redefinição de senha
  resetPasswordToken: String,

  // Data de expiração do token de redefinição de senha
  resetPasswordExpires: Date,

  // Data do último login
  lastLoginAt: Date,

  // Status da conta
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  // Configurações do schema
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// ============ MIDDLEWARE PRÉ-SAVE ============
/**
 * Middleware que é executado antes de salvar o documento
 * Criptografa a senha automaticamente quando é criada ou modificada
 */
UserSchema.pre('save', async function (next) {
  // Só criptografa se a senha foi modificada E existe
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Middleware para atualizar updatedAt
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// ============ MÉTODOS DE INSTÂNCIA ============
/**
 * Método que verifica se a senha fornecida corresponde à senha armazenada
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Método para verificar se o usuário é administrador
 */
UserSchema.methods.isAdministrator = function () {
  return this.isAdmin || this.role === 'admin' || this.role === 'superadmin';
};

/**
 * Método para verificar se o usuário é super administrador
 */
UserSchema.methods.isSuperAdmin = function () {
  return this.role === 'superadmin';
};

/**
 * Método para obter dados públicos do usuário
 */
UserSchema.methods.getPublicData = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    isEmailVerified: this.isEmailVerified,
    isAdmin: this.isAdmin,
    role: this.role,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt
  };
};

// ============ MÉTODOS ESTÁTICOS ============
/**
 * Encontra usuário por email (case insensitive)
 */
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Encontra usuários administradores
 */
UserSchema.statics.findAdmins = function () {
  return this.find({ $or: [{ isAdmin: true }, { role: { $in: ['admin', 'superadmin'] } }] });
};

// ============ ÍNDICES MANUAIS (apenas os que não são automáticos) ============
// email e googleId já têm unique: true, então índices são criados automaticamente
UserSchema.index({ registrationToken: 1 }, { sparse: true });
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isAdmin: 1 });
UserSchema.index({ role: 1 });

module.exports = mongoose.model('User', UserSchema);
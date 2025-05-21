const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Esquema de usuário que define a estrutura do documento na coleção do MongoDB
 * Contém todos os campos necessários para gerenciar usuários e autenticação
 */
const UserSchema = new mongoose.Schema({
  // Nome do usuário
  name: {
    type: String,
    required: [true, 'Por favor, informe um nome']
  },

  // Email do usuário
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true,     // Garante que o email seja único na coleção
    lowercase: true   // Converte automaticamente para minúsculas
  },

  // Senha do usuário
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Função condicional: senha só é obrigatória se não tiver login pelo Google
    },
    minlength: 6,   // Exige pelo menos 6 caracteres
    select: false   // Por padrão, não inclui este campo nas consultas (segurança)
  },

  // ID do Google para autenticação OAuth
  googleId: {
    type: String
  },

  // Flag para controlar se o email foi verificado
  isEmailVerified: {
    type: Boolean,
    default: false    // Por padrão, o email não está verificado
  },

  // Token para verificação de email
  emailVerificationToken: String,

  // Data de expiração do token de verificação de email
  emailVerificationExpires: Date,

  // Token para redefinição de senha
  resetPasswordToken: String,

  // Data de expiração do token de redefinição de senha
  resetPasswordExpires: Date,

  // Data de criação da conta
  createdAt: {
    type: Date,
    default: Date.now   // Define automaticamente para a data/hora atual
  }
});

/**
 * Middleware que é executado antes de salvar o documento
 * Criptografa a senha automaticamente quando é criada ou modificada
 */
UserSchema.pre('save', async function (next) {
  // Verifica se a senha foi modificada (ou é nova)
  // Isso evita recriptografar a senha em outras atualizações do usuário
  if (!this.isModified('password')) return next();

  // Gera um salt (valor aleatório) para tornar o hash mais seguro
  // O valor 10 define o custo computacional (mais alto = mais seguro, porém mais lento)
  const salt = await bcrypt.genSalt(10);

  // Criptografa a senha com o salt gerado
  this.password = await bcrypt.hash(this.password, salt);

  // Continua o processo de salvamento
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
  // Compara a senha fornecida com o hash armazenado
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
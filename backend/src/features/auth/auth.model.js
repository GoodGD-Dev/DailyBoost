const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe um nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Senha não é obrigatória se tiver googleId
    },
    minlength: 6,
    select: false
  },
  googleId: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
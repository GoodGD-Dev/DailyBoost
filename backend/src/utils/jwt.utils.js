const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Envia resposta com token JWT em cookie
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Gerar o token JWT
  const token = generateToken(user.id || user._id); // Aceita ambos os formatos de ID

  // Configurar o cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN.replace('d', '')) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Enviar a resposta com o cookie configurado
  return res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
};

module.exports = { generateToken, sendTokenResponse };
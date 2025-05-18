const jwt = require('jsonwebtoken');
const User = require('./auth.model');

exports.protect = async (req, res, next) => {
  let token;

  // Verificar se há token no cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. É necessário fazer login.'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário e verificar se o email foi confirmado
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Por favor, verifique seu email antes de acessar esta rota'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. Token inválido.'
    });
  }
};
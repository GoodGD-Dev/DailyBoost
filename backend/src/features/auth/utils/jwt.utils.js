const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT
 * Cria um token assinado contendo o ID do usuário
 */
const generateToken = (id) => {
  // Cria e assina o token JWT com o ID do usuário como payload
  return jwt.sign(
    { id }, // Payload: contém apenas o ID do usuário
    process.env.JWT_SECRET, // Chave secreta usada para assinar o token
    {
      expiresIn: process.env.JWT_EXPIRES_IN // Tempo de expiração do token
    }
  );
};

/**
 * Envia resposta com token JWT em cookie
 * Função utilitária que gera o token, configura o cookie e envia a resposta
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Gerar o token JWT usando a função auxiliar
  const token = generateToken(user.id || user._id);

  // Define a data de expiração do cookie
  // Converte o formato "30d" (30 dias) para milissegundos
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN.replace('d', '')) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Cookie acessível apenas pelo servidor, não por JavaScript (segurança)
    secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
    sameSite: 'strict' // Restringe envio do cookie apenas para o mesmo site (segurança)
  };

  // Enviar a resposta com o cookie configurado
  return res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token, // Incluir token na resposta para clientes que preferem usar headers
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        role: user.role
      }
    });
};

/**
 * Verifica se um token é válido sem lançar erro
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decodifica um token sem verificar (útil para extrair info expirada)
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Gera um token de refresh (com tempo de vida maior)
 */
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
  );
};

module.exports = {
  generateToken,
  sendTokenResponse,
  verifyToken,
  decodeToken,
  generateRefreshToken
};
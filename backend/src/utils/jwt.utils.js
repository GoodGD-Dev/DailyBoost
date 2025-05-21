const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT
 * Cria um token assinado contendo o ID do usuário
 * 
 * @param {string} id - ID do usuário para incluir no payload do token
 * @returns {string} - Token JWT assinado
 */
const generateToken = (id) => {
  // Cria e assina o token JWT com o ID do usuário como payload
  return jwt.sign(
    { id },                     // Payload: contém apenas o ID do usuário
    process.env.JWT_SECRET,     // Chave secreta usada para assinar o token
    {
      expiresIn: process.env.JWT_EXPIRES_IN // Tempo de expiração do token)
    });
};

/**
 * Envia resposta com token JWT em cookie
 * Função utilitária que gera o token, configura o cookie e envia a resposta
 * 
 * @param {Object} user - Objeto do usuário autenticado
 * @param {number} statusCode - Código de status HTTP para a resposta
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} - Resposta HTTP com token e dados do usuário
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Gerar o token JWT usando a função auxiliar
  // Aceita tanto user.id (formato Mongoose) quanto user._id (formato bruto do MongoDB)
  const token = generateToken(user.id || user._id); // Aceita ambos os formatos de ID

  // Define a data de expiração do cookie
  // Converte o formato "30d" (30 dias) para milissegundos
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN.replace('d', '')) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,   // Cookie acessível apenas pelo servidor, não por JavaScript (segurança)
    secure: process.env.NODE_ENV === 'production',    // HTTPS apenas em produção
    sameSite: 'strict'  // Restringe envio do cookie apenas para o mesmo site (segurança)
  };

  // Enviar a resposta com o cookie configurado
  return res
    .status(statusCode)         // Define o código de status HTTP da resposta
    .cookie('token', token, cookieOptions)  // Define o cookie com o token e opções
    .json({
      success: true,            // Indica sucesso na operação
      user: {
        // Dados básicos do usuário (sem informações sensíveis)
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
};

module.exports = { generateToken, sendTokenResponse };
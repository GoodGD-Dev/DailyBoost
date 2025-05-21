const jwt = require('jsonwebtoken');
const User = require('./auth.model');

/**
 * Middleware de proteção de rotas
 * Verifica se o usuário está autenticado antes de permitir acesso a rotas protegidas
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar para o próximo middleware
 */

exports.protect = async (req, res, next) => {
  // Variável que armazenará o token JWT
  let token;

  // Verifica se existe um token nos cookies da requisição
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Se não encontrou um token, retorna erro 401 (Não Autorizado)
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. É necessário fazer login.'
    });
  }

  try {
    // Verifica se o token é válido usando a chave secreta definida em variáveis de ambiente
    // decoded contém os dados que foram incluídos no payload do token (geralmente o ID do usuário)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca o usuário no banco de dados usando o ID extraído do token
    const user = await User.findById(decoded.id);

    // Se o usuário não for encontrado no banco, retorna erro 401
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Se o usuário não confirmou se email, retorna erro 401
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Por favor, verifique seu email antes de acessar esta rota'
      });
    }

    // Se tudo estiver correto, anexa o objeto do usuário à requisição
    // Isso permite que outros middlewares e controladores acessem os dados do usuário
    req.user = user;

    // Passa para o próximo middleware na cadeia, permitindo que a requisição continue
    next();
  } catch (error) {
    // Em caso de qualquer erro
    // Retorna erro 401 (Não Autorizado)
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. Token inválido.'
    });
  }
};
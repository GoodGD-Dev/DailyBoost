/**
 * Middleware de verificação de administrador
 * Verifica se o usuário autenticado tem permissões administrativas
 * DEVE ser usado APÓS o middleware protect
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
exports.adminOnly = (req, res, next) => {
  // Verifica se existe um usuário na requisição (vem do middleware protect)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. É necessário fazer login primeiro.'
    });
  }

  // Verifica se o usuário tem permissão de administrador
  // Usa o método isAdministrator() do modelo ou verifica o campo isAdmin
  const isUserAdmin = req.user.isAdministrator ? req.user.isAdministrator() : req.user.isAdmin;

  if (!isUserAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar esta rota.'
    });
  }

  // Se chegou até aqui, o usuário é administrador
  // Passa para o próximo middleware na cadeia
  next();
};

/**
 * Middleware para verificar super administrador
 * Para operações mais sensíveis que requerem nível máximo de permissão
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
exports.superAdminOnly = (req, res, next) => {
  // Verifica se existe um usuário na requisição
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. É necessário fazer login primeiro.'
    });
  }

  // Verifica se o usuário é super administrador
  const isSuperAdmin = req.user.isSuperAdmin ? req.user.isSuperAdmin() : req.user.role === 'superadmin';

  if (!isSuperAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas super administradores podem acessar esta rota.'
    });
  }

  // Se chegou até aqui, o usuário é super administrador
  next();
};

/**
 * Middleware flexível para verificar roles específicos
 * Permite verificar múltiplos roles de uma vez
 * 
 * @param {...string} roles - Lista de roles permitidos
 * @returns {Function} - Middleware function
 */
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    // Verifica se existe um usuário na requisição
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado. É necessário fazer login primeiro.'
      });
    }

    // Verifica se o usuário tem algum dos roles necessários
    const userRole = req.user.role || 'user';

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado. É necessário ter um dos seguintes perfis: ${roles.join(', ')}`
      });
    }

    // Se chegou até aqui, o usuário tem o role necessário
    next();
  };
};
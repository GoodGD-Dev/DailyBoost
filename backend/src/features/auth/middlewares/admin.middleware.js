/**
 * Middleware de verificação de administrador
 * Verifica se o usuário autenticado tem permissões administrativas
 * DEVE ser usado APÓS o middleware protect
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
  const isUserAdmin = req.user.isAdministrator ? req.user.isAdministrator() : req.user.isAdmin;

  if (!isUserAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar esta rota.'
    });
  }

  // Se chegou até aqui, o usuário é administrador
  next();
};

/**
 * Middleware para verificar super administrador
 * Para operações mais sensíveis que requerem nível máximo de permissão
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

  next();
};

/**
 * Middleware flexível para verificar roles específicos
 * Permite verificar múltiplos roles de uma vez
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

    next();
  };
};

/**
 * Middleware para verificar se o usuário pode modificar outro usuário
 * Evita que usuários modifiquem contas de hierarquia superior
 */
exports.canModifyUser = async (req, res, next) => {
  try {
    const User = require('../auth.model');
    const targetUserId = req.params.id || req.params.userId;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário é obrigatório'
      });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Super admin pode modificar qualquer um
    if (req.user.role === 'superadmin') {
      req.targetUser = targetUser;
      return next();
    }

    // Admin não pode modificar super admin
    if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Você não pode modificar um super administrador'
      });
    }

    // Usuário não pode modificar admins
    if (req.user.role === 'user' && (targetUser.role === 'admin' || targetUser.role === 'superadmin')) {
      return res.status(403).json({
        success: false,
        message: 'Você não pode modificar um administrador'
      });
    }

    req.targetUser = targetUser;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissões'
    });
  }
};
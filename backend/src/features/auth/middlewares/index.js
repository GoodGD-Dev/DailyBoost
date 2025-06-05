const { protect } = require('./routeguard.middleware');
const { adminOnly, superAdminOnly, requireRole } = require('./admin.middleware');

module.exports = {
  // Middleware de autenticação
  protect,

  // Middlewares de autorização
  adminOnly,
  superAdminOnly,
  requireRole
};
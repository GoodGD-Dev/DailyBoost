const adminAuthMiddleware = require('./admin-auth.middleware');

module.exports = {
  requireAdminSession: adminAuthMiddleware.requireAdminSession,
  redirectIfLoggedIn: adminAuthMiddleware.redirectIfLoggedIn,
  loadAdminUser: adminAuthMiddleware.loadAdminUser,
  requireSuperAdmin: adminAuthMiddleware.requireSuperAdmin
};
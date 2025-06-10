module.exports = {
  protect: require('./routeguard.middleware').protect,
  optionalAuth: require('./routeguard.middleware').optionalAuth,
  adminOnly: require('./admin.middleware').adminOnly,
  superAdminOnly: require('./admin.middleware').superAdminOnly,
  requireRole: require('./admin.middleware').requireRole,
  canModifyUser: require('./admin.middleware').canModifyUser
};
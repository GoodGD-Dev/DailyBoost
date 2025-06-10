module.exports = {
  routes: require('./admin.routes'),
  authRoutes: require('./auth.routes'),
  controller: require('./admin.controller'),
  authController: require('./auth.controller'),
  service: require('./admin.service'),
  validation: require('./admin.validation'),
  middlewares: require('./middlewares')
};
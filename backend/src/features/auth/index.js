module.exports = {
  routes: require('./auth.routes'),
  controller: require('./auth.controller'),
  service: require('./auth.service'),
  model: require('./auth.model'),
  validation: require('./auth.validation'),
  middlewares: require('./middlewares'),
  jobs: require('./jobs'),
  utils: require('./utils'),
  config: require('./config')
};
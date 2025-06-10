module.exports = {
  errorHandler: require('./error.middleware').errorHandler,
  notFound: require('./error.middleware').notFound,
  asyncHandler: require('./error.middleware').asyncHandler,
  corsConfig: require('./cors.middleware'),
  sessionConfig: require('./session.middleware')
};
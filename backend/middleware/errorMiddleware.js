exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erro no servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // StatusCode padrão (500 se não especificado)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro no servidor';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
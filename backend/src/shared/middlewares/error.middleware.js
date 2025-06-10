const { httpStatus, messages } = require('../constants');

/**
 * Middleware global de tratamento de erros
 * Captura erros em toda a aplicação e fornece respostas consistentes
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error('🔥 Error Handler:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = { message, statusCode: httpStatus.NOT_FOUND };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Recurso duplicado';
    error = { message, statusCode: httpStatus.CONFLICT };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: httpStatus.BAD_REQUEST };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = { message, statusCode: httpStatus.UNAUTHORIZED };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = { message, statusCode: httpStatus.UNAUTHORIZED };
  }

  // Rate limiting error
  if (err.status === httpStatus.TOO_MANY_REQUESTS) {
    const message = messages.SYSTEM.RATE_LIMIT_EXCEEDED;
    error = { message, statusCode: httpStatus.TOO_MANY_REQUESTS };
  }

  // CORS error
  if (err.message && err.message.includes('CORS')) {
    const message = 'Origem não permitida';
    error = { message, statusCode: httpStatus.FORBIDDEN };
  }

  // Define código de status padrão
  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  // Define mensagem padrão
  const message = error.message || messages.SYSTEM.SERVER_ERROR;

  // Resposta de erro estruturada
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para capturar rotas não encontradas
 */
const notFound = (req, res, next) => {
  const error = new Error(`${messages.SYSTEM.ROUTE_NOT_FOUND}: ${req.originalUrl}`);
  error.statusCode = httpStatus.NOT_FOUND;
  next(error);
};

/**
 * Middleware para tratar async/await errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
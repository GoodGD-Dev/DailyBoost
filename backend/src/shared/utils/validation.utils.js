const { validationResult } = require('express-validator');
const { httpStatus } = require('../constants');

/**
 * Middleware para verificar erros de validação
 */
const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Dados inválidos',
      errors: errorMessages
    });
  }

  next();
};

/**
 * Sanitiza dados de entrada
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
    .slice(0, 1000); // Limita tamanho
};

/**
 * Valida se é um ObjectId válido do MongoDB
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Valida formato de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida força da senha
 */
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 6,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;

  return {
    isValid: requirements.minLength && requirements.hasLowercase && requirements.hasUppercase && requirements.hasNumber,
    score,
    requirements,
    strength: score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong'
  };
};

/**
 * Escape HTML para prevenir XSS
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Valida e sanitiza dados de paginação
 */
const validatePagination = (page, limit, maxLimit = 100) => {
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit) || 20));

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit
  };
};

/**
 * Middleware para sanitizar request body
 */
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

module.exports = {
  checkValidationErrors,
  sanitizeInput,
  isValidObjectId,
  isValidEmail,
  validatePassword,
  escapeHtml,
  validatePagination,
  sanitizeBody
};
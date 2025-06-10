const cors = require('cors');

const corsConfig = cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);

    // Lista de origens permitidas
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000'
    ].filter(Boolean); // Remove valores undefined/null

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // Cache preflight por 24 horas
});

module.exports = corsConfig;
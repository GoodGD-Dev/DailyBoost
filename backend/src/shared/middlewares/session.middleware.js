const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = session({
  secret: process.env.ADMIN_SESSION_SECRET || 'admin-supersecret-key',
  resave: false,
  saveUninitialized: false,
  name: 'admin.sid', // Nome customizado para o cookie de sessão
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS em produção
    httpOnly: true, // Previne acesso via JavaScript
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'strict' // Proteção CSRF
  },
  store: process.env.MONGO_URI ? MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'admin_sessions',
    ttl: 24 * 60 * 60 // TTL em segundos (24 horas)
  }) : undefined,
  rolling: true // Renova o cookie a cada requisição
});

module.exports = sessionConfig;
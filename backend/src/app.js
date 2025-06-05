const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { errorHandler } = require('./middlewares');

// Rotas
const authRoutes = require('./features/auth/auth.routes');
const adminAuthRoutes = require('./features/admin/auth.routes');
const adminRoutes = require('./features/admin/admin.routes');

// Inicializar o app Express
const app = express();

// Configurar view engine para o painel admin
app.set('view engine', 'ejs');
app.set('views', './src/features/admin/views');

// Configurar middlewares globais
app.use(express.json());
app.use(cookieParser());

// Configurar sessões para o painel admin
app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET || 'admin-supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS em produção
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Flash messages para o admin
app.use(flash());

// CORS para API
app.use('/api', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rotas da API
app.use('/api/auth', authRoutes);

// Rotas do painel admin
app.use('/admin', adminAuthRoutes);  // Login/logout do admin
app.use('/admin', adminRoutes);      // Dashboard e funcionalidades

// Redirecionar /admin para /admin/login ou /admin/dashboard
app.get('/admin', (req, res) => {
  if (req.session && req.session.adminUser) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
});

// Rota para verificar se a API está rodando (health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Middleware para lidar com rotas não encontradas (404)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.originalUrl}`
  });
});

// Middleware global de tratamento de erros
app.use(errorHandler);

module.exports = app;
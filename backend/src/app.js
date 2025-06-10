const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// Shared middlewares e utils
const { errorHandler, corsConfig, sessionConfig } = require('./shared/middlewares');

// Routes centralizadas
const routes = require('./routes');

// Inicializar o app Express
const app = express();

// Configurar view engine para o painel admin
app.set('view engine', 'ejs');
app.set('views', './src/features/admin/views');

// Configurar middlewares globais
app.use(express.json());
app.use(cookieParser());

// Configurar sessões para o painel admin
app.use(sessionConfig);

// Flash messages para o admin
app.use(flash());

// CORS para API
app.use('/api', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Usar todas as rotas
app.use('/', routes);

// Redirecionar /admin para /admin/login ou /admin/dashboard
app.get('/admin', (req, res) => {
  if (req.session && req.session.adminUser) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
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
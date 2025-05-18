// src/app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares');

// Importar rotas
const authRoutes = require('./features/auth/auth.routes');
// No futuro, adicione outras rotas aqui à medida que criar novas features
// const profileRoutes = require('./features/profile/profile.routes');
// const postRoutes = require('./features/post/post.routes');

// Inicializar o app Express
const app = express();

// Configurar middlewares globais
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar rotas da API
app.use('/api/auth', authRoutes);
// No futuro, adicione outras rotas aqui à medida que criar novas features
// app.use('/api/profile', profileRoutes);
// app.use('/api/posts', postRoutes);

// Rota para verificar se a API está rodando
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Middleware para lidar com rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.originalUrl}`
  });
});

// Middleware global de tratamento de erros
app.use(errorHandler);

module.exports = app;
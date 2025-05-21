const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares');

// Rotas
const authRoutes = require('./features/auth/auth.routes');

// Inicializar o app Express
const app = express();

// Configurar middlewares globais
// Estes middlewares são aplicados a todas as rotas

// Middleware para analisar o corpo das requisições em formato JSON
app.use(express.json());

// Middleware para analisar cookies nas requisições
app.use(cookieParser());

// Configura o CORS (Cross-Origin Resource Sharing) para permitir requisições do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,    // Origem permitida (URL do frontend)
  credentials: true,                   // Permite o envio de cookies em requisições cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Configurar rotas da API
// Define o prefixo '/api/auth' para todas as rotas de autenticação
app.use('/api/auth', authRoutes);

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
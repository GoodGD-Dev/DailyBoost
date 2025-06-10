// Carrega as variáveis de ambiente
require('dotenv').config();

// Validar variáveis de ambiente
const { validateEnvironment } = require('./config/environment');
validateEnvironment();

// Importa a aplicação e configurações
const app = require('./app');
const { database } = require('./config');
const GlobalScheduler = require('./schedulers');

// Define a porta do servidor
const PORT = process.env.PORT || 5000;

/**
 * Função que inicializa o servidor
 */
const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await database();

    // Inicializar schedulers
    GlobalScheduler.init();

    // Iniciar o servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Dashboard admin: http://localhost:${PORT}/admin`);
      console.log(`🔗 API health check: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Recebido SIGTERM, encerrando servidor...');
  GlobalScheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Recebido SIGINT, encerrando servidor...');
  GlobalScheduler.stop();
  process.exit(0);
});

startServer();
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config');

const PORT = process.env.PORT || 5000;

// Inicializar o servidor
const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();

    // Iniciar o servidor HTTP
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
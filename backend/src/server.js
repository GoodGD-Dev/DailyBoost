// Carrega as variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

// Importa a aplicação Express configurada
const app = require('./app');

// Importa a função de conexão com o banco de dados da pasta config
const { connectDB } = require('./config');

// Define a porta do servidor, usando a variável de ambiente PORT ou 5000 como fallback
const PORT = process.env.PORT || 5000;

/**
 * Função assíncrona que inicializa o servidor
 * Separa o processo de inicialização em uma função para melhor tratamento de erros
 */
const startServer = async () => {
  try {
    // Conectar ao MongoDB usando a função importada
    // await garante que o servidor só será iniciado após a conexão bem-sucedida
    await connectDB();

    // Iniciar o servidor HTTP na porta especificada
    app.listen(PORT, () => {
      // Exibe mensagem de sucesso no console com informações sobre porta e ambiente
      console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    // Captura e exibe qualquer erro durante a inicialização
    console.error('Erro ao iniciar o servidor:', error);

    // Encerra o processo Node.js com código de erro (1)
    // Isso permite que sistemas de gerenciamento de processos (PM2, Docker) reiniciem a aplicação
    process.exit(1);
  }
};

startServer();
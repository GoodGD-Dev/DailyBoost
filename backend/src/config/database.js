const mongoose = require('mongoose');

/**
 * Função assíncrona que estabelece conexão com o banco de dados MongoDB
 * Usando async/await para lidar com operações assíncronas de forma limpa
 */
const connectDB = async () => {
  try {
    // Tenta conectar ao MongoDB usando a URI armazenada em variável de ambiente
    // await espera que a promessa de conexão seja resolvida antes de continuar
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Exibe mensagem de sucesso no console, mostrando o host da conexão
    console.log(`MongoDB conectado: ${conn.connection.host}`);

    // Retorna o objeto de conexão para possível uso posterior
    return conn;
  } catch (error) {
    // Captura e trata qualquer erro ocorrido durante a tentativa de conexão
    // Exibe mensagem de erro detalhada no console
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);

    // Encerra o processo do Node.js com código de erro (1)
    // Isso indica que o aplicativo não pode continuar sem a conexão ao banco
    process.exit(1);
  }
};

// Exporta a função connectDB para ser utilizada em outros arquivos do projeto
module.exports = connectDB;
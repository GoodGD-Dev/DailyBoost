const mongoose = require('mongoose');

/**
 * Função assíncrona que estabelece conexão com o banco de dados MongoDB
 */
const connectDB = async () => {
  try {
    // Configurações de conexão do MongoDB
    const options = {
      // Configurações de performance
      maxPoolSize: 10, // Máximo de 10 conexões simultâneas
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos para seleção do servidor
      socketTimeoutMS: 45000, // Timeout de 45 segundos para operações

      // Configurações de bufferdd
      bufferCommands: false, // Desabilita buffering de comandos

      // Configurações de retry
      retryWrites: true,

      // Configurações de compressão (opcional)
      compressors: ['zlib']
    };

    // Tenta conectar ao MongoDB usando a URI armazenada em variável de ambiente
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    // Exibe mensagem de sucesso no console
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Eventos de conexão para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro de conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

    // Configurações de debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', false); // Desabilitar para reduzir logs
    }

    // Retorna o objeto de conexão
    return conn;
  } catch (error) {
    // Captura e trata qualquer erro ocorrido durante a tentativa de conexão
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);

    // Em desenvolvimento, mostra mais detalhes do erro
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
    }

    // Encerra o processo do Node.js com código de erro (1)
    process.exit(1);
  }
};

/**
 * Função para fechar conexão com o banco (útil para testes)
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 Conexão MongoDB fechada');
  } catch (error) {
    console.error('❌ Erro ao fechar conexão MongoDB:', error);
  }
};

// Exporta as funções para serem utilizadas em outros arquivos do projeto
module.exports = {
  connectDB,
  disconnectDB
};
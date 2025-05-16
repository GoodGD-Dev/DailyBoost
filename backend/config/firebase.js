const admin = require('firebase-admin');
const path = require('path');

try {
  // Caminho para o arquivo de credenciais
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

  // Carregar as credenciais do arquivo
  const serviceAccount = require(serviceAccountPath);

  // Inicializar o admin com as credenciais corretas
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'dailyboost-b5b11' // Especificar o ID do projeto correto
  });

  console.log('Firebase Admin inicializado com sucesso para o projeto:', serviceAccount.project_id);
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin:', error.message);

  // Fallback para desenvolvimento (apenas se o arquivo não existir)
  if (process.env.NODE_ENV === 'development') {
    console.warn('Inicializando Firebase Admin em modo de desenvolvimento com projectId correto');
    admin.initializeApp({
      projectId: 'dailyboost-b5b11' // Usar o ID do projeto correto aqui também
    });
  } else {
    // Em produção, relanço o erro
    throw error;
  }
}

module.exports = admin;
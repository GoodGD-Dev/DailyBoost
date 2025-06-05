const admin = require('firebase-admin');

try {
  // Cria um objeto de credenciais usando variáveis de ambiente
  // Este objeto contém todas as informações necessárias para autenticar no Firebase
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    // A expressão regular substitui '\n' por quebras de linha reais
    // Isso é necessário porque as variáveis de ambiente geralmente não preservam quebras de linha
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Importante: substitui \n por quebras de linha reais
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  };

  // Inicializa o SDK do Firebase Admin com as credenciais criadas
  admin.initializeApp({
    // Utiliza o método cert() para criar um objeto de credencial a partir do serviceAccount
    credential: admin.credential.cert(serviceAccount),
    // Define o ID do projeto explicitamente (embora já esteja no serviceAccount)
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  // Registra mensagem de sucesso no console
  console.log('Firebase Admin inicializado com sucesso usando variáveis de ambiente');
} catch (error) {
  // Captura e trata erros durante a inicialização
  console.error('Erro ao inicializar Firebase Admin:', error.message);

  // Verifica se o ambiente é de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    // Fallback para ambiente de desenvolvimento - inicialização simplificada
    // Útil quando credenciais completas não estão disponíveis durante desenvolvimento
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('Firebase inicializado em modo de desenvolvimento');
  } else {
    // Se não for ambiente de desenvolvimento, propaga o erro
    // Isso força que em produção a inicialização só ocorra com credenciais válidas
    throw error;
  }
}

module.exports = admin;
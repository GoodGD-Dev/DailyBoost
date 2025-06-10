const admin = require('firebase-admin');

try {
  // Cria um objeto de credenciais usando variáveis de ambiente
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    // A expressão regular substitui '\n' por quebras de linha reais
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  };

  // Verificar se as variáveis essenciais estão definidas
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error('Credenciais Firebase incompletas');
  }

  // Inicializa o SDK do Firebase Admin com as credenciais criadas
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error.message);

  // Verifica se o ambiente é de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️ Firebase funcionando em modo de desenvolvimento limitado');

    // Fallback para ambiente de desenvolvimento
    try {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project'
      });
      console.log('🔧 Firebase inicializado em modo de desenvolvimento');
    } catch (devError) {
      console.error('❌ Falha no fallback de desenvolvimento:', devError.message);
    }
  } else {
    // Em produção, propaga o erro
    throw error;
  }
}

module.exports = admin;
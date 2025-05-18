const admin = require('firebase-admin');

try {
  // Criar objeto de credenciais a partir das variáveis de ambiente
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Importante: substitui \n por quebras de linha reais
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  };

  // Inicializar o Firebase Admin com as credenciais
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  console.log('Firebase Admin inicializado com sucesso usando variáveis de ambiente');
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin:', error.message);

  if (process.env.NODE_ENV === 'development') {
    // Fallback para desenvolvimento
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'dailyboost-b5b11'
    });
    console.log('Firebase inicializado em modo de desenvolvimento');
  } else {
    throw error;
  }
}

module.exports = admin;
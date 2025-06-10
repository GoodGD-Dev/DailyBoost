const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN'
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
  'ADMIN_SESSION_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM_NAME',
  'APP_NAME'
];

const validateEnvironment = () => {
  console.log('🔍 Validando variáveis de ambiente...');

  // Verificar variáveis obrigatórias
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}`);
  }

  // Verificar variáveis opcionais e mostrar avisos
  const missingOptional = optionalEnvVars.filter(envVar => !process.env[envVar]);

  if (missingOptional.length > 0) {
    console.warn('⚠️ Variáveis de ambiente opcionais não encontradas:');
    missingOptional.forEach(envVar => console.warn(`   - ${envVar}`));
  }

  // Validações específicas
  validateSpecificVars();

  console.log('✅ Validação de ambiente concluída');
};

const validateSpecificVars = () => {
  // Validar JWT_EXPIRES_IN
  if (process.env.JWT_EXPIRES_IN && !process.env.JWT_EXPIRES_IN.match(/^\d+[dhms]$/)) {
    throw new Error('JWT_EXPIRES_IN deve estar no formato: 30d, 24h, 60m, etc.');
  }

  // Validar NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    console.warn(`⚠️ NODE_ENV '${process.env.NODE_ENV}' não é um valor padrão. Valores recomendados: ${validEnvs.join(', ')}`);
  }

  // Validar PORT
  if (process.env.PORT && (isNaN(process.env.PORT) || parseInt(process.env.PORT) < 1 || parseInt(process.env.PORT) > 65535)) {
    throw new Error('PORT deve ser um número entre 1 e 65535');
  }

  // Validar EMAIL_PORT
  if (process.env.EMAIL_PORT && (isNaN(process.env.EMAIL_PORT) || parseInt(process.env.EMAIL_PORT) < 1 || parseInt(process.env.EMAIL_PORT) > 65535)) {
    throw new Error('EMAIL_PORT deve ser um número entre 1 e 65535');
  }

  // Verificar se MONGO_URI parece válida
  if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb')) {
    throw new Error('MONGO_URI deve começar com mongodb:// ou mongodb+srv://');
  }
};

const getEnvironmentInfo = () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    hasEmailConfig: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER),
    hasFirebaseConfig: !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  };
};

module.exports = {
  validateEnvironment,
  getEnvironmentInfo,
  requiredEnvVars,
  optionalEnvVars
};

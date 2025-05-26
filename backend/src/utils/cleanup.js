const authService = require('../features/Auth/services/auth.service');

const runCleanup = async () => {
  try {
    console.log('🚀 Iniciando limpeza automática...');
    const deletedCount = await authService.cleanupExpiredRegistrations();

    if (deletedCount > 0) {
      console.log(`✅ ${deletedCount} registros expirados removidos`);
    } else {
      console.log('✅ Nenhum registro expirado encontrado');
    }
  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
  }
};

module.exports = { runCleanup };
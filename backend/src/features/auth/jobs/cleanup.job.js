const authService = require('../auth.service');

/**
 * Job de limpeza automática de registros expirados
 * Remove usuários que não completaram o registro e têm token expirado
 */
const runCleanup = async () => {
  try {
    console.log('🚀 Iniciando limpeza automática...');

    const deletedCount = await authService.cleanupExpiredRegistrations();

    if (deletedCount > 0) {
      console.log(`✅ ${deletedCount} registros expirados removidos`);
    } else {
      console.log('✅ Nenhum registro expirado encontrado');
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
    throw error;
  }
};

/**
 * Job manual para testes ou execução via API
 */
const runManualCleanup = async () => {
  console.log('🔧 Executando limpeza manual...');
  return await runCleanup();
};

module.exports = {
  runCleanup,
  runManualCleanup
};
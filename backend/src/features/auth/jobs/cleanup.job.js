const authService = require('../auth.service');

/**
 * Job de limpeza automática de registros expirados
 * Remove usuários que não completaram o registro e têm token expirado
 */
const runCleanup = async () => {
  try {
    console.log('🚀 Iniciando limpeza automática de registros expirados...');

    const deletedCount = await authService.cleanupExpiredRegistrations();

    if (deletedCount > 0) {
      console.log(`✅ ${deletedCount} registros expirados removidos`);
    } else {
      console.log('✅ Nenhum registro expirado encontrado');
    }

    return {
      success: true,
      deletedCount,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erro na limpeza automática:', error);
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

/**
 * Limpeza específica para registros muito antigos (mais de 7 dias)
 */
const runDeepCleanup = async () => {
  try {
    console.log('🔍 Iniciando limpeza profunda...');

    const User = require('../auth.model');

    // Remove registros incompletos com mais de 7 dias
    const result = await User.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      $or: [
        { name: { $exists: false } },
        { name: null },
        { password: { $exists: false } },
        { password: null }
      ]
    });

    console.log(`🧹 Limpeza profunda: ${result.deletedCount} registros antigos removidos`);

    return {
      success: true,
      deletedCount: result.deletedCount,
      type: 'deep_cleanup',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erro na limpeza profunda:', error);
    throw error;
  }
};

module.exports = {
  runCleanup,
  runManualCleanup,
  runDeepCleanup
};
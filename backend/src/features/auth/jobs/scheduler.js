const cron = require('node-cron');
const { runCleanup, runDeepCleanup } = require('./cleanup.job');

/**
 * Configuração dos jobs de limpeza automática
 */
class AuthScheduler {
  static jobs = {};
  static isInitialized = false;

  /**
   * Inicializa todos os jobs programados
   */
  static init() {
    if (this.isInitialized) {
      console.log('⚠️ Auth scheduler já foi inicializado');
      return;
    }

    console.log('📅 Inicializando Auth scheduler...');

    try {
      // Job principal: Limpeza diária às 2h da manhã
      this.jobs.dailyCleanup = cron.schedule('0 2 * * *', async () => {
        const timestamp = new Date().toISOString();
        console.log(`🕐 [${timestamp}] Executando limpeza diária automática...`);

        try {
          await runCleanup();
          console.log(`✅ [${timestamp}] Limpeza diária concluída com sucesso`);
        } catch (error) {
          console.error(`❌ [${timestamp}] Erro na limpeza diária:`, error);
        }
      }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
      });

      // Job semanal: Limpeza profunda (domingo às 3h)
      this.jobs.weeklyCleanup = cron.schedule('0 3 * * 0', async () => {
        const timestamp = new Date().toISOString();
        console.log(`🕐 [${timestamp}] Executando limpeza semanal...`);

        try {
          await runDeepCleanup();
          console.log(`✅ [${timestamp}] Limpeza semanal concluída com sucesso`);
        } catch (error) {
          console.error(`❌ [${timestamp}] Erro na limpeza semanal:`, error);
        }
      }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
      });

      this.isInitialized = true;

      console.log('✅ Auth scheduler configurado com sucesso!');
      console.log('📋 Jobs ativos:');
      console.log('  • Limpeza diária: Todo dia às 2h');
      console.log('  • Limpeza semanal: Domingo às 3h');

    } catch (error) {
      console.error('❌ Erro ao inicializar Auth scheduler:', error);
      throw error;
    }
  }

  /**
   * Para todos os jobs
   */
  static stop() {
    console.log('🛑 Parando Auth scheduler...');

    Object.keys(this.jobs).forEach(jobName => {
      if (this.jobs[jobName]) {
        this.jobs[jobName].stop();
        console.log(`  • ${jobName} parado`);
      }
    });

    this.jobs = {};
    this.isInitialized = false;
    console.log('✅ Auth scheduler parado');
  }

  /**
   * Reinicia todos os jobs
   */
  static restart() {
    console.log('🔄 Reiniciando Auth scheduler...');
    this.stop();
    this.init();
  }

  /**
   * Executa limpeza manual
   */
  static async runManualCleanup() {
    console.log('🔧 Executando limpeza manual do Auth...');

    try {
      const result = await runCleanup();
      console.log('✅ Limpeza manual do Auth concluída');
      return result;
    } catch (error) {
      console.error('❌ Erro na limpeza manual do Auth:', error);
      throw error;
    }
  }

  /**
   * Retorna status dos jobs
   */
  static getStatus() {
    const activeJobs = Object.keys(this.jobs).filter(jobName =>
      this.jobs[jobName] && this.jobs[jobName].running !== false
    );

    return {
      isInitialized: this.isInitialized,
      totalJobs: Object.keys(this.jobs).length,
      activeJobs: activeJobs.length,
      jobs: activeJobs,
      lastCheck: new Date().toISOString()
    };
  }

  /**
   * Verifica se um job específico está rodando
   */
  static isJobRunning(jobName) {
    return this.jobs[jobName] && this.jobs[jobName].running !== false;
  }
}

module.exports = AuthScheduler;
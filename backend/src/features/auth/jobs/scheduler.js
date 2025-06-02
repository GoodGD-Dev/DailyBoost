const cron = require('node-cron');
const { runCleanup } = require('./cleanup.job');

/**
 * Configuração dos jobs de limpeza automática
 */
class Scheduler {
  static jobs = {};

  /**
   * Inicializa todos os jobs programados
   */
  static init() {
    console.log('📅 Inicializando scheduler de limpeza automática...');

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

    // Job opcional: Limpeza semanal mais profunda (domingo às 3h)
    this.jobs.weeklyCleanup = cron.schedule('0 3 * * 0', async () => {
      const timestamp = new Date().toISOString();
      console.log(`🕐 [${timestamp}] Executando limpeza semanal...`);

      try {
        await runCleanup();
        console.log(`✅ [${timestamp}] Limpeza semanal concluída com sucesso`);
      } catch (error) {
        console.error(`❌ [${timestamp}] Erro na limpeza semanal:`, error);
      }
    }, {
      scheduled: true,
      timezone: "America/Sao_Paulo"
    });

    console.log('✅ Scheduler configurado com sucesso!');
    console.log('📋 Jobs ativos:');
    console.log('   • Limpeza diária: Todo dia às 2h');
    console.log('   • Limpeza semanal: Domingo às 3h');
  }

  /**
   * Para todos os jobs
   */
  static stop() {
    console.log('🛑 Parando todos os jobs...');

    Object.keys(this.jobs).forEach(jobName => {
      if (this.jobs[jobName]) {
        this.jobs[jobName].stop();
        console.log(`   • ${jobName} parado`);
      }
    });

    this.jobs = {};
    console.log('✅ Todos os jobs foram parados');
  }

  /**
   * Reinicia todos os jobs
   */
  static restart() {
    console.log('🔄 Reiniciando scheduler...');
    this.stop();
    this.init();
  }

  /**
   * Executa limpeza manual (útil para testes)
   */
  static async runManualCleanup() {
    console.log('🔧 Executando limpeza manual...');
    try {
      const result = await runCleanup();
      console.log('✅ Limpeza manual concluída');
      return result;
    } catch (error) {
      console.error('❌ Erro na limpeza manual:', error);
      throw error;
    }
  }

  /**
   * Retorna status dos jobs
   */
  static getStatus() {
    const activeJobs = Object.keys(this.jobs).filter(jobName =>
      this.jobs[jobName] && this.jobs[jobName].running
    );

    return {
      totalJobs: Object.keys(this.jobs).length,
      activeJobs: activeJobs.length,
      jobs: activeJobs
    };
  }
}

module.exports = Scheduler;
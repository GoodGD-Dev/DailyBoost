const { AuthScheduler } = require('../features/Auth/jobs');

/**
 * Scheduler global que gerencia todos os features
 * Cada feature tem seu próprio scheduler
 */
class GlobalScheduler {
  static featureSchedulers = {
    auth: AuthScheduler
  };

  /**
   * Inicializa todos os schedulers de todos os features
   */
  static init() {
    console.log('🚀 Inicializando schedulers globais...');

    Object.entries(this.featureSchedulers).forEach(([feature, scheduler]) => {
      try {
        scheduler.init();
      } catch (error) {
        console.error(`❌ Erro ao inicializar scheduler do ${feature}:`, error);
      }
    });

    console.log('✅ Todos os schedulers foram inicializados!');
  }

  /**
   * Para todos os schedulers
   */
  static stop() {
    console.log('🛑 Parando todos os schedulers...');

    Object.entries(this.featureSchedulers).forEach(([feature, scheduler]) => {
      try {
        scheduler.stop();
      } catch (error) {
        console.error(`❌ Erro ao parar scheduler do ${feature}:`, error);
      }
    });

    console.log('✅ Todos os schedulers foram parados');
  }

  /**
   * Reinicia todos os schedulers
   */
  static restart() {
    console.log('🔄 Reiniciando todos os schedulers...');
    this.stop();
    this.init();
  }

  /**
   * Retorna status de todos os schedulers
   */
  static getStatus() {
    const status = {};

    Object.entries(this.featureSchedulers).forEach(([feature, scheduler]) => {
      try {
        status[feature] = scheduler.getStatus();
      } catch (error) {
        status[feature] = { error: error.message };
      }
    });

    return {
      totalFeatures: Object.keys(this.featureSchedulers).length,
      features: status,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Acesso direto aos schedulers dos features
   */
  static get auth() {
    return this.featureSchedulers.auth;
  }

  // No futuro você pode adicionar:
  // static get users() {
  //   return this.featureSchedulers.users;
  // }
}

module.exports = GlobalScheduler;
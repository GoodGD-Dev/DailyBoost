const AuthScheduler = require('../features/auth/jobs/scheduler');

/**
 * Scheduler global que gerencia todos os features
 * Cada feature tem seu próprio scheduler
 */
class GlobalScheduler {
  static featureSchedulers = {
    auth: AuthScheduler
  };

  static isInitialized = false;

  /**
   * Inicializa todos os schedulers de todos os features
   */
  static init() {
    if (this.isInitialized) {
      console.log('⚠️ GlobalScheduler já foi inicializado');
      return;
    }

    console.log('🚀 Inicializando schedulers globais...');

    Object.entries(this.featureSchedulers).forEach(([feature, scheduler]) => {
      try {
        if (scheduler && typeof scheduler.init === 'function') {
          scheduler.init();
          console.log(`✅ Scheduler do ${feature} inicializado`);
        } else {
          console.warn(`⚠️ Scheduler do ${feature} não possui método init`);
        }
      } catch (error) {
        console.error(`❌ Erro ao inicializar scheduler do ${feature}:`, error);
      }
    });

    this.isInitialized = true;
    console.log('✅ Inicialização de schedulers globais concluída!');
  }

  /**
   * Para todos os schedulers
   */
  static stop() {
    console.log('🛑 Parando todos os schedulers...');

    Object.entries(this.featureSchedulers).forEach(([feature, scheduler]) => {
      try {
        if (scheduler && typeof scheduler.stop === 'function') {
          scheduler.stop();
          console.log(`🛑 Scheduler do ${feature} parado`);
        }
      } catch (error) {
        console.error(`❌ Erro ao parar scheduler do ${feature}:`, error);
      }
    });

    this.isInitialized = false;
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
        if (scheduler && typeof scheduler.getStatus === 'function') {
          status[feature] = scheduler.getStatus();
        } else {
          status[feature] = {
            status: 'not_implemented',
            message: 'Scheduler não implementa método getStatus'
          };
        }
      } catch (error) {
        status[feature] = {
          status: 'error',
          error: error.message
        };
      }
    });

    return {
      isInitialized: this.isInitialized,
      totalFeatures: Object.keys(this.featureSchedulers).length,
      features: status,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Verifica se todos os schedulers estão funcionando
   */
  static healthCheck() {
    const status = this.getStatus();
    const healthyFeatures = Object.values(status.features).filter(
      feature => feature.status !== 'error'
    ).length;

    return {
      healthy: healthyFeatures === status.totalFeatures,
      healthyFeatures,
      totalFeatures: status.totalFeatures,
      healthPercentage: Math.round((healthyFeatures / status.totalFeatures) * 100),
      status: status.isInitialized ? 'running' : 'stopped',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Acesso direto aos schedulers dos features
   */
  static get auth() {
    return this.featureSchedulers.auth;
  }

  /**
   * Adiciona um novo scheduler de feature
   */
  static addFeatureScheduler(featureName, scheduler) {
    if (this.featureSchedulers[featureName]) {
      console.warn(`⚠️ Scheduler do feature '${featureName}' já existe. Substituindo...`);
    }

    this.featureSchedulers[featureName] = scheduler;
    console.log(`📅 Scheduler do feature '${featureName}' adicionado`);

    // Se o sistema já foi inicializado, inicializa o novo scheduler
    if (this.isInitialized && scheduler && typeof scheduler.init === 'function') {
      try {
        scheduler.init();
        console.log(`✅ Scheduler do ${featureName} inicializado automaticamente`);
      } catch (error) {
        console.error(`❌ Erro ao inicializar scheduler do ${featureName}:`, error);
      }
    }
  }

  /**
   * Remove um scheduler de feature
   */
  static removeFeatureScheduler(featureName) {
    if (this.featureSchedulers[featureName]) {
      try {
        if (typeof this.featureSchedulers[featureName].stop === 'function') {
          this.featureSchedulers[featureName].stop();
        }
      } catch (error) {
        console.error(`❌ Erro ao parar scheduler do ${featureName}:`, error);
      }

      delete this.featureSchedulers[featureName];
      console.log(`🗑️ Scheduler do feature '${featureName}' removido`);
    } else {
      console.warn(`⚠️ Scheduler do feature '${featureName}' não encontrado`);
    }
  }

  /**
   * Executa operação em scheduler específico
   */
  static async executeOnScheduler(featureName, method, ...args) {
    const scheduler = this.featureSchedulers[featureName];

    if (!scheduler) {
      throw new Error(`Scheduler do feature '${featureName}' não encontrado`);
    }

    if (typeof scheduler[method] !== 'function') {
      throw new Error(`Método '${method}' não encontrado no scheduler do ${featureName}`);
    }

    try {
      return await scheduler[method](...args);
    } catch (error) {
      console.error(`❌ Erro ao executar ${method} no scheduler do ${featureName}:`, error);
      throw error;
    }
  }

  /**
   * Lista todos os features disponíveis
   */
  static listFeatures() {
    return Object.keys(this.featureSchedulers);
  }

  /**
   * Verifica se um feature específico está registrado
   */
  static hasFeature(featureName) {
    return featureName in this.featureSchedulers;
  }

  /**
   * Obtém estatísticas gerais dos schedulers
   */
  static getStatistics() {
    const status = this.getStatus();
    const health = this.healthCheck();

    return {
      ...health,
      features: status.features,
      uptime: this.isInitialized ? 'running' : 'stopped',
      lastCheck: new Date().toISOString()
    };
  }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM recebido. Parando schedulers...');
  GlobalScheduler.stop();
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT recebido. Parando schedulers...');
  GlobalScheduler.stop();
});

module.exports = GlobalScheduler;
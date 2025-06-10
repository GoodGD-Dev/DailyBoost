const express = require('express');
const router = express.Router();

// Features
const authFeature = require('../features/auth');
const adminFeature = require('../features/admin');

// Middleware para log de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
  });
}

// API Routes
router.use('/api/auth', authFeature.routes);

// Admin Routes
router.use('/admin', adminFeature.authRoutes); // Login/logout do admin
router.use('/admin', adminFeature.routes);      // Dashboard e funcionalidades

// Health check routes
router.get('/api/health', (req, res) => {
  const { getEnvironmentInfo } = require('../config/environment');
  const GlobalScheduler = require('../schedulers');

  const healthData = {
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    environment: getEnvironmentInfo(),
    schedulers: GlobalScheduler.healthCheck(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  };

  res.status(200).json(healthData);
});

// Status detalhado para admins
router.get('/api/status', authFeature.middlewares.protect, authFeature.middlewares.adminOnly, (req, res) => {
  const GlobalScheduler = require('../schedulers');

  const statusData = {
    success: true,
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch
    },
    schedulers: GlobalScheduler.getStatistics(),
    environment: process.env.NODE_ENV,
    features: ['auth', 'admin']
  };

  res.status(200).json(statusData);
});

// Rota para métricas (útil para monitoramento)
router.get('/api/metrics', authFeature.middlewares.protect, authFeature.middlewares.adminOnly, async (req, res) => {
  try {
    const User = authFeature.model;

    const metrics = {
      timestamp: new Date().toISOString(),
      users: {
        total: await User.countDocuments(),
        admins: await User.countDocuments({ isAdmin: true }),
        active: await User.countDocuments({ isActive: true }),
        pending: await User.countDocuments({ registrationToken: { $exists: true } }),
        completed: await User.countDocuments({
          name: { $exists: true },
          password: { $exists: true }
        })
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    };

    res.status(200).json({
      success: true,
      metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter métricas',
      error: error.message
    });
  }
});

// Rota raiz
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Backend - Organizada por Features',
    version: '1.0.0',
    features: ['auth', 'admin'],
    endpoints: {
      api: '/api/auth',
      admin: '/admin',
      health: '/api/health',
      status: '/api/status (admin only)',
      metrics: '/api/metrics (admin only)'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
const { connectDB, disconnectDB } = require('./database');
const { validateEnvironment } = require('./environment');

module.exports = {
  database: connectDB,
  disconnectDB,
  validateEnvironment
};
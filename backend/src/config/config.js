require('dotenv').config({ path: '../../.env' });

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'test_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'test_refresh_secret',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/webforge'
};

if (process.env.NODE_ENV === 'test') {
  config.jwtAccessSecret = 'test_access_secret';
  config.jwtRefreshSecret = 'test_refresh_secret';
  config.mongoUri = 'mongodb://localhost:27017/webforge_test';
}

module.exports = config;

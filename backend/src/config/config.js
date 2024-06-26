require('dotenv').config({ path: '../../.env' });

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'test_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'test_refresh_secret',
};

if (process.env.NODE_ENV === 'test') {
  config.jwtAccessSecret = 'test_access_secret';
  config.jwtRefreshSecret = 'test_refresh_secret';
}

module.exports = config;

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

function authMiddleware(req, res, next) {
  const accessToken = req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(accessToken, config.jwtAccessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', refreshRequired: true });
    }
    logger.error('Invalid token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Invalid token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;

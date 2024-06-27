const logger = require('../utils/logger');

function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Unauthorized access attempt', { requestId: req.id });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', { user: req.user.username, requiredRole: roles, userRole: req.user.role, requestId: req.id });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

module.exports = authorize;

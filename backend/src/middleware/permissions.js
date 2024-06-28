const logger = require('../utils/logger');

const PERMISSIONS = {
  CREATE_MODULE: 'create_module',
  UPDATE_MODULE: 'update_module',
  DELETE_MODULE: 'delete_module',
  VIEW_MODULE: 'view_module'
};

const ROLE_PERMISSIONS = {
  admin: [PERMISSIONS.CREATE_MODULE, PERMISSIONS.UPDATE_MODULE, PERMISSIONS.DELETE_MODULE, PERMISSIONS.VIEW_MODULE],
  user: [PERMISSIONS.VIEW_MODULE]
};

function checkPermission(permission) {
  return (req, res, next) => {
    logger.info('Checking permission', { permission, user: req.user ? req.user.username : 'unknown', requestId: req.id });
    if (!req.user) {
      logger.warn('Unauthorized access attempt', { requestId: req.id });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    logger.info('User permissions', { userPermissions, userRole: req.user.role, requestId: req.id });

    if (!userPermissions.includes(permission)) {
      logger.warn('Insufficient permissions', { 
        user: req.user.username, 
        requiredPermission: permission, 
        userRole: req.user.role, 
        requestId: req.id 
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    logger.info('Permission check passed', { permission, user: req.user.username, requestId: req.id });
    next();
  };
}

module.exports = {
  checkPermission,
  PERMISSIONS
};

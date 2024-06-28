const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      requestId: req.id
    });
  });
  next();
}

module.exports = requestLogger;

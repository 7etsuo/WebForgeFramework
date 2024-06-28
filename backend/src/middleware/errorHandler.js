const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  logger.error(err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // For unhandled errors
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
}

module.exports = errorHandler;

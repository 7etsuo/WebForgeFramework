const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'webforge-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

function logWithRequestId(level, message, meta = {}) {
  const requestId = meta.requestId || uuidv4();
  logger.log(level, message, { ...meta, requestId });
}

module.exports = {
  error: (message, meta) => logWithRequestId('error', message, meta),
  warn: (message, meta) => logWithRequestId('warn', message, meta),
  info: (message, meta) => logWithRequestId('info', message, meta),
  http: (message, meta) => logWithRequestId('http', message, meta),
  verbose: (message, meta) => logWithRequestId('verbose', message, meta),
  debug: (message, meta) => logWithRequestId('debug', message, meta),
  silly: (message, meta) => logWithRequestId('silly', message, meta),
};


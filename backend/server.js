const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');
const addRequestId = require('./src/middleware/addRequestId');
const { connectDB, closeDB } = require('./src/config/database');
const requestLogger = require('./src/middleware/requestLogger');
const WasmWatcher = require('./src/services/wasmWatcher');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addRequestId);
app.use(requestLogger);

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, { requestId: req.id });
  next();
});

// Force HTTPS in production
if (config.nodeEnv === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(globalLimiter);

// More stringent rate limiting for sensitive routes
if (config.nodeEnv !== 'test') {
  // Global rate limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(globalLimiter);

  // More stringent rate limiting for sensitive routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.'
  });
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);
}
// Routes
const apiRoutes = require('./src/routes/apiRoutes');
app.use('/api', apiRoutes);

// Serve WebAssembly files
app.use('/wasm', express.static(path.join(__dirname, 'wasm', 'build')));

// Error handling middleware
app.use(errorHandler);

async function startServer(port = config.port) {
  await connectDB();
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port} in ${config.nodeEnv} mode`);
      resolve(server);
    });

    // WebSocket server setup
    const wss = new WebSocket.Server({ server });
    const wsHandler = require('./src/services/wsHandler');

    wss.on('connection', (ws) => {
      wsHandler.addClient(ws);

      ws.on('message', (message) => {
        wsHandler.handleMessage(message);
      });

      ws.on('close', () => {
        wsHandler.removeClient(ws);
      });
    });

    // Start the WebAssembly watcher
    const wasmDir = path.join(__dirname, '..', 'wasm', 'build');
    const wasmWatcher = new WasmWatcher(wasmDir);
    wasmWatcher.start();
  });
}

async function stopServer(server) {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await closeDB();
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, stopServer };

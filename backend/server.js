const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

/* Middleware */
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Logging */
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

/* Rate limiting */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, /* 15 minutes */
  max: 100 /* limit each IP to 100 requests per windowMs */
});
app.use('/api', limiter);

/* Routes */
const apiRoutes = require('./src/routes/apiRoutes');
app.use('/api', apiRoutes);

/* Serve WebAssembly files */
app.use('/wasm', express.static(path.join(__dirname, '..', 'wasm', 'build')));

/* Error handling middleware */
app.use(errorHandler);

/* Create HTTP server */
const server = http.createServer(app);

/* WebSocket server */
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

/* Start server */
server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

module.exports = app; /* For testing purposes */

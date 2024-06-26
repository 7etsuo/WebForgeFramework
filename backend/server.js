const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');
const addRequestId = require('./src/middleware/addRequestId');

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected successfully'))
.catch((err) => logger.error('MongoDB connection error:', err));

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addRequestId);

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
const apiRoutes = require('./src/routes/apiRoutes');
app.use('/api', apiRoutes);

// Serve WebAssembly files
app.use('/wasm', express.static(path.join(__dirname, 'wasm', 'build')));

// Error handling middleware
app.use(errorHandler);

// Create HTTP server
const server = config.nodeEnv === 'production'
  ? https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
    }, app)
  : http.createServer(app);

// WebSocket server
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

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

module.exports = app; // For testing purposes

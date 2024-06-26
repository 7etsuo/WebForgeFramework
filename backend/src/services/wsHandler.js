const logger = require('../utils/logger');

class WebSocketHandler {
  constructor() {
    this.clients = new Set();
  }

  addClient(ws) {
    this.clients.add(ws);
    logger.info('New WebSocket client connected');
  }

  removeClient(ws) {
    this.clients.delete(ws);
    logger.info('WebSocket client disconnected');
  }

  handleMessage(message) {
    logger.info('Received WebSocket message:', message);
    // Handle WebSocket messages
    // You may want to parse the message and take appropriate actions
  }

  broadcast(message) {
    for (let client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}

module.exports = new WebSocketHandler();

# WebForge Framework User Documentation
<p align="center">
  <img src="https://github.com/7etsuo/WebForgeFramework/assets/90065760/656dcaad-021f-4f29-a5fc-f0dd54af16b1" alt="WebForge Framework">
</p>

#### Developed by [@7etsuo](https://x.com/7etsuo)
Join our community on [Discord](https://discord.com/invite/EJDrhVVXjb)!

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Framework Overview](#2-framework-overview)
3. [Project Structure](#3-project-structure)
4. [Backend Components](#4-backend-components)
5. [Frontend Setup](#5-frontend-setup)
6. [WebAssembly Integration](#6-webassembly-integration)
7. [API Reference](#7-api-reference)
8. [Authentication](#8-authentication)
9. [Database Integration](#9-database-integration)
10. [WebSocket Functionality](#10-websocket-functionality)
11. [Deployment Guide](#11-deployment-guide)
12. [Troubleshooting](#12-troubleshooting)
13. [Contributing](#13-contributing)

## 1. Introduction

WebForge is a robust web application framework designed to seamlessly integrate WebAssembly modules with a full-stack JavaScript environment. It provides a solid foundation for building high-performance web applications that leverage the power of WebAssembly while maintaining the flexibility and ease of use of modern web technologies.

## 2. Framework Overview

WebForge consists of three main components:
- Backend: A Node.js server using Express.js
- Frontend: A React-based client application
- WebAssembly: C/C++ code compiled to WebAssembly modules

Key features:
- RESTful API for WebAssembly module management
- JWT-based authentication
- Real-time updates via WebSockets
- MongoDB integration for data persistence
- Modular architecture for easy customization and extension

## 3. Project Structure

```
/WebForge
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── wasm/
│   ├── src/
│   ├── build/
│   └── compile-wasm.sh
├── .gitignore
└── README.md
```

## 4. Backend Components

### server.js
The main entry point for the backend server. It sets up Express.js, middleware, and starts the HTTP server.

### src/config/config.js
Contains configuration settings loaded from environment variables.

### src/controllers/
Contains logic for handling API requests:
- `authController.js`: Manages user authentication
- `wasmController.js`: Handles WebAssembly module operations

### src/middleware/
Custom middleware functions:
- `authMiddleware.js`: Verifies JWT tokens for protected routes
- `errorHandler.js`: Global error handling
- `validateRequest.js`: Input validation using Joi

### src/models/
Mongoose models for MongoDB:
- `User.js`: User account schema
- `RefreshToken.js`: Refresh token schema
- `WebAssemblyModule.js`: WebAssembly module metadata schema

### src/routes/apiRoutes.js
Defines API endpoints and links them to controller functions.

### src/services/
- `wasmService.js`: Business logic for WebAssembly module operations
- `wsHandler.js`: WebSocket message handling

### src/utils/
Utility functions and helpers:
- `logger.js`: Logging utility using Winston

## 5. Frontend Setup

(Note: The frontend is not fully implemented in the current version. This section provides a guide for setting it up.)

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

The frontend should be built using React and should interact with the backend API for authentication and WebAssembly module management.

## 6. WebAssembly Integration

### Compiling WebAssembly Modules

1. Place your C/C++ source files in the `wasm/src/` directory
2. Use the `compile-wasm.sh` script to compile your code:
   ```
   ./wasm/compile-wasm.sh your_file.c
   ```
3. The compiled `.wasm` file will be placed in `wasm/build/`

### Uploading WebAssembly Modules

Use the `/api/wasm/modules` POST endpoint to upload a new module:

```javascript
const response = await fetch('/api/wasm/modules', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({
    name: 'module_name',
    content: 'base64_encoded_wasm_binary'
  })
});
```

### Using WebAssembly Modules in the Frontend

1. Fetch the module:
   ```javascript
   const response = await fetch('/api/wasm/modules/module_name');
   const wasmBinary = await response.arrayBuffer();
   ```

2. Instantiate the module:
   ```javascript
   const wasmModule = await WebAssembly.instantiate(wasmBinary);
   ```

3. Call exported functions:
   ```javascript
   const result = wasmModule.instance.exports.your_function(args);
   ```

## 7. API Reference

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: Authenticate and receive JWT tokens
- `POST /api/token`: Refresh access token
- `DELETE /api/logout`: Invalidate refresh token

### WebAssembly Modules
- `GET /api/wasm/modules`: List all modules
- `GET /api/wasm/modules/:name`: Get a specific module
- `POST /api/wasm/modules`: Create a new module
- `PUT /api/wasm/modules/:name`: Update an existing module

## 8. Authentication

WebForge uses JWT for authentication. After logging in, you'll receive an access token and a refresh token. Include the access token in the Authorization header for protected routes:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 9. Database Integration

WebForge uses MongoDB for data persistence. Ensure you have MongoDB installed and running, then update the `MONGO_URI` in your `.env` file.

## 10. WebSocket Functionality

WebForge includes WebSocket support for real-time updates. Connect to the WebSocket server and listen for events:

```javascript
const socket = new WebSocket('ws://your-server-url');
socket.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

## 11. Deployment Guide

1. Set up a MongoDB database (e.g., MongoDB Atlas)
2. Configure environment variables for production
3. Build the frontend: `cd frontend && npm run build`
4. Deploy the backend to a Node.js hosting service (e.g., Heroku, DigitalOcean)
5. Serve the frontend build directory as static files or deploy to a CDN

## 12. Troubleshooting

- Ensure all dependencies are installed: `npm install` in both `backend/` and `frontend/`
- Check MongoDB connection string in `.env`
- Verify that WebAssembly modules are correctly compiled and accessible

## 13. Contributing

Contributions to WebForge are welcome! Please refer to the `CONTRIBUTING.md` file (if available) for guidelines on how to contribute to the project.

For more detailed information or specific inquiries, please refer to the inline documentation in each file or reach out to the project maintainers.

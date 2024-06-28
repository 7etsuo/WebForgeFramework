# WebForge Backend Documentation

## Architecture Overview

The WebForge backend is built using Node.js and Express.js, following a modular architecture with clear separation of concerns. It provides RESTful API endpoints for user authentication, WebAssembly module management, and real-time updates via WebSockets.

## Key Components

1. **Server Configuration** (`server.js`)
   - Express application setup
   - Middleware configuration (CORS, Helmet, compression, etc.)
   - HTTP server creation
   - WebSocket server initialization
   - Database connection
   - WebAssembly module watcher

2. **Configuration** (`src/config/config.js`)
   - Environment-specific configurations
   - JWT secrets
   - MongoDB URI

3. **Database** (`src/config/database.js`)
   - MongoDB connection setup
   - Connection and disconnection methods

4. **Models**
   - `User.js`: User account schema and methods
   - `RefreshToken.js`: Refresh token schema
   - `WebAssemblyModule.js`: WebAssembly module metadata schema

5. **Controllers**
   - `authController.js`: Handles user registration, login, token refresh, and logout
   - `wasmController.js`: Manages WebAssembly module operations (list, get, create, update)

6. **Middleware**
   - `authMiddleware.js`: JWT token verification
   - `errorHandler.js`: Global error handling
   - `validateRequest.js`: Request validation using Joi
   - `permissions.js`: Role-based access control
   - `addRequestId.js`: Adds unique request ID to each request
   - `requestLogger.js`: Logs incoming requests

7. **Services**
   - `wasmService.js`: Business logic for WebAssembly module operations
   - `wsHandler.js`: WebSocket message handling
   - `wasmWatcher.js`: Monitors WebAssembly module directory for changes

8. **Routes** (`src/routes/apiRoutes.js`)
   - Defines API endpoints and links them to controllers

9. **Utilities**
   - `logger.js`: Logging utility using Winston

## API Endpoints

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

## Security Features

1. JWT-based authentication
2. Password hashing using bcrypt
3. Role-based access control
4. Request validation
5. CORS configuration
6. Helmet for setting various HTTP headers

## WebSocket Functionality

The backend includes a WebSocket server for real-time updates. It supports:
- Client connection management
- Message broadcasting
- Custom message handling

## Logging

The application uses Winston for logging, with different log levels and formats for development and production environments.

## Error Handling

A global error handler middleware captures and formats errors, providing consistent error responses across the application.

## Testing

Jest is used for unit and integration testing. Test files are located in the `__tests__` directory.

## Environment Variables

Key environment variables:
- `PORT`: Server port
- `NODE_ENV`: Environment (development, test, production)
- `JWT_ACCESS_SECRET`: Secret for JWT access tokens
- `JWT_REFRESH_SECRET`: Secret for JWT refresh tokens
- `MONGO_URI`: MongoDB connection string

## Running the Backend

1. Install dependencies: `npm install`
2. Set up environment variables in `.env` file
3. Start the server: `npm start`
4. For development with auto-reload: `npm run dev`


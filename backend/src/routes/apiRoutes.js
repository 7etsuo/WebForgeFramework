const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const addRequestId = require('../middleware/addRequestId');

const authController = require('../controllers/authController');
const wasmController = require('../controllers/wasmController');

// Add request ID to all requests
router.use(addRequestId);

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'WebForge API' });
});

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Authentication routes
router.post('/register', validateRequest.register, authController.register);
router.post('/login', validateRequest.login, authController.login);
router.post('/token', validateRequest.refreshToken, authController.refreshToken);
router.delete('/logout', authMiddleware, authController.logout);

// WebAssembly routes (protected)
router.use('/wasm', authMiddleware);
router.get('/wasm/modules', wasmController.listModules);
router.get('/wasm/modules/:name', validateRequest.getModule, wasmController.getModule);
router.post('/wasm/modules', validateRequest.createModule, wasmController.createModule);
router.put('/wasm/modules/:name', validateRequest.updateModule, wasmController.updateModule);

module.exports = router;

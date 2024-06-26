const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const addRequestId = require('../middleware/addRequestId');
const wasmController = require('../controllers/wasmController');
const authController = require('../controllers/authController');

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
router.post('/login', authLimiter, validateRequest.login, authController.login);
router.post('/token', authLimiter, validateRequest.refreshToken, authController.refreshToken);
router.delete('/logout', validateRequest.logout, authController.logout);

// Protected routes
router.use(authMiddleware);

router.get('/wasm/modules', wasmController.listModules);
router.get('/wasm/modules/:name', validateRequest.getModule, wasmController.getModule);
router.post('/wasm/modules/:name', validateRequest.updateModule, wasmController.updateModule);

module.exports = router;

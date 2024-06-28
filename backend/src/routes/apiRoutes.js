const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { checkPermission, PERMISSIONS } = require('../middleware/permissions');
const validateRequest = require('../middleware/validateRequest');
const addRequestId = require('../middleware/addRequestId');
const wasmController = require('../controllers/wasmController');
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'wasm', 'build'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.wasm')
  }
});

const upload = multer({ storage: storage });

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
router.post('/register', authLimiter, validateRequest.register, authController.register);
router.post('/login', authLimiter, validateRequest.login, authController.login);
router.post('/token', authLimiter, validateRequest.refreshToken, authController.refreshToken);
router.delete('/logout', validateRequest.logout, authController.logout);

// Protected routes
router.use(authMiddleware);

// WebAssembly routes
router.get('/wasm/modules', checkPermission(PERMISSIONS.VIEW_MODULE), wasmController.listModules);
router.get('/wasm/modules/:name', checkPermission(PERMISSIONS.VIEW_MODULE), validateRequest.getModule, wasmController.getModule);
router.post('/wasm/modules', checkPermission(PERMISSIONS.CREATE_MODULE), upload.single('file'), wasmController.createModule);
router.put('/wasm/modules/:name', checkPermission(PERMISSIONS.UPDATE_MODULE), validateRequest.updateModule, wasmController.updateModule);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

module.exports = router;

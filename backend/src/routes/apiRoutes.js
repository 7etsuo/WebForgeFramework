const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const wasmController = require('../controllers/wasmController');
const authController = require('../controllers/authController');

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'WebForge API' });
});

// Authentication routes
router.post('/login', authController.login);
router.post('/token', authController.refreshToken);
router.delete('/logout', authController.logout);

// Protected routes
router.use(authMiddleware);

router.get('/wasm/modules', wasmController.listModules);
router.get('/wasm/modules/:name', validateRequest.getModule, wasmController.getModule);
router.post('/wasm/modules/:name', validateRequest.updateModule, wasmController.updateModule);

module.exports = router;

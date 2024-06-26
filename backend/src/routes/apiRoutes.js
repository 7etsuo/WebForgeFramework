const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const wasmController = require('../controllers/wasmController');

/* Public routes */
router.get('/', (req, res) => {
  res.json({ message: 'WebForge API' });
});

/* Protected routes */
router.use(authMiddleware);

router.get('/wasm/modules', wasmController.listModules);
router.get('/wasm/modules/:name', validateRequest.getModule, wasmController.getModule);
router.post('/wasm/modules/:name', validateRequest.updateModule, wasmController.updateModule);

module.exports = router;

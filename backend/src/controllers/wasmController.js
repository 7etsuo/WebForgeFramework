const wasmService = require('../services/wasmService');
const logger = require('../utils/logger');

exports.listModules = async (req, res, next) => {
  try {
    const modules = await wasmService.listModules();
    res.json(modules);
  } catch (error) {
    logger.error('Error listing modules:', error);
    next(error);
  }
};

exports.getModule = async (req, res, next) => {
  try {
    const module = await wasmService.getModule(req.params.name);
    res.type('application/wasm').send(module);
  } catch (error) {
    logger.error(`Error getting module ${req.params.name}:`, error);
    next(error);
  }
};

exports.updateModule = async (req, res, next) => {
  try {
    await wasmService.updateModule(req.params.name, req.body);
    res.json({ message: 'Module updated successfully' });
  } catch (error) {
    logger.error(`Error updating module ${req.params.name}:`, error);
    next(error);
  }
};


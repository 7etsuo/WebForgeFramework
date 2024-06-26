const wasmService = require('../services/wasmService');
const logger = require('../utils/logger');

exports.listModules = async (req, res, next) => {
  try {
    const modules = await wasmService.listModules();
    logger.info('WebAssembly modules listed', { count: modules.length, requestId: req.id });
    res.json(modules);
  } catch (error) {
    logger.error('Error listing WebAssembly modules', { error: error.message, requestId: req.id });
    next(error);
  }
};

exports.getModule = async (req, res, next) => {
  try {
    const module = await wasmService.getModule(req.params.name);
    logger.info('WebAssembly module retrieved', { moduleName: req.params.name, requestId: req.id });
    res.type('application/wasm').send(module);
  } catch (error) {
    logger.error('Error getting WebAssembly module', { 
      error: error.message, 
      moduleName: req.params.name, 
      requestId: req.id 
    });
    next(error);
  }
};

exports.updateModule = async (req, res, next) => {
  try {
    await wasmService.updateModule(req.params.name, req.body);
    logger.info('WebAssembly module updated', { moduleName: req.params.name, requestId: req.id });
    res.json({ message: 'Module updated successfully' });
  } catch (error) {
    logger.error('Error updating WebAssembly module', { 
      error: error.message, 
      moduleName: req.params.name, 
      requestId: req.id 
    });
    next(error);
  }
};

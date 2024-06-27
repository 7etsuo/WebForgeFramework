const WebAssemblyModule = require('../models/WebAssemblyModule');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

exports.listModules = async (req, res, next) => {
  try {
    const modules = await WebAssemblyModule.find().select('name description version');
    logger.info('WebAssembly modules listed', { count: modules.length, requestId: req.id });
    res.json(modules);
  } catch (error) {
    logger.error('Error listing WebAssembly modules', { error: error.message, requestId: req.id });
    next(error);
  }
};

exports.getModule = async (req, res, next) => {
  try {
    const module = await WebAssemblyModule.findOne({ name: req.params.name });
    if (!module) {
      logger.warn('WebAssembly module not found', { moduleName: req.params.name, requestId: req.id });
      return res.status(404).json({ error: 'Module not found' });
    }
    const fileContent = await fs.readFile(module.filePath);
    logger.info('WebAssembly module retrieved', { moduleName: req.params.name, requestId: req.id });
    res.type('application/wasm').send(fileContent);
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
    const { name, description, version, content } = req.body;
    const module = await WebAssemblyModule.findOne({ name: req.params.name });
    
    if (!module) {
      logger.warn('WebAssembly module not found for update', { moduleName: req.params.name, requestId: req.id });
      return res.status(404).json({ error: 'Module not found' });
    }

    module.description = description || module.description;
    module.version = version || module.version;

    if (content) {
      await fs.writeFile(module.filePath, Buffer.from(content));
    }

    await module.save();

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

exports.createModule = async (req, res, next) => {
  try {
    const { name, description, version, content } = req.body;
    const filePath = path.join(__dirname, '..', '..', 'wasm', 'build', `${name}.wasm`);

    await fs.writeFile(filePath, Buffer.from(content));

    const newModule = new WebAssemblyModule({
      name,
      description,
      version,
      author: req.user.id, // Assuming we have user info from auth middleware
      filePath
    });

    await newModule.save();

    logger.info('New WebAssembly module created', { moduleName: name, requestId: req.id });
    res.status(201).json({ message: 'Module created successfully', module: newModule });
  } catch (error) {
    logger.error('Error creating WebAssembly module', { 
      error: error.message, 
      requestId: req.id 
    });
    next(error);
  }
};

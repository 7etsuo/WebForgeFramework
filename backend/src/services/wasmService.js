const WebAssemblyModule = require('../models/WebAssemblyModule');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class WebAssemblyService {
  constructor() {
    this.wasmDir = path.join(__dirname, '..', '..', 'wasm', 'build');
  }

  async getModule(moduleName) {
    try {
      const module = await WebAssemblyModule.findOne({ name: moduleName });
      if (!module) {
        throw new Error('Module not found');
      }
      const filePath = path.join(this.wasmDir, `${moduleName}.wasm`);
      const buffer = await fs.readFile(filePath);
      return buffer;
    } catch (error) {
      logger.error(`Error loading WebAssembly module ${moduleName}:`, error);
      throw new Error('Failed to load WebAssembly module');
    }
  }

  async updateModule(moduleName, newModuleData) {
    try {
      const module = await WebAssemblyModule.findOne({ name: moduleName });
      if (!module) {
        throw new Error('Module not found');
      }
      
      if (newModuleData.content) {
        const filePath = path.join(this.wasmDir, `${moduleName}.wasm`);
        await fs.writeFile(filePath, Buffer.from(newModuleData.content));
      }

      Object.assign(module, newModuleData);
      await module.save();
      
      logger.info(`WebAssembly module ${moduleName} updated successfully`);
    } catch (error) {
      logger.error(`Error updating WebAssembly module ${moduleName}:`, error);
      throw new Error('Failed to update WebAssembly module');
    }
  }

  async listModules() {
    try {
      const modules = await WebAssemblyModule.find().select('name description version');
      return modules;
    } catch (error) {
      logger.error('Error listing WebAssembly modules:', error);
      throw new Error('Failed to list WebAssembly modules');
    }
  }

  async createModule(moduleData) {
    try {
      const { name, content, ...rest } = moduleData;
      const filePath = path.join(this.wasmDir, `${name}.wasm`);
      await fs.writeFile(filePath, Buffer.from(content));

      const newModule = new WebAssemblyModule({
        name,
        filePath,
        ...rest
      });

      await newModule.save();
      logger.info(`New WebAssembly module ${name} created successfully`);
      return newModule;
    } catch (error) {
      logger.error('Error creating WebAssembly module:', error);
      throw new Error('Failed to create WebAssembly module');
    }
  }
}

module.exports = new WebAssemblyService();

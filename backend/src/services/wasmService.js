const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class WebAssemblyService {
  constructor() {
    this.wasmDir = path.join(__dirname, '..', '..', '..', 'wasm', 'build');
  }

  async getModule(moduleName) {
    const filePath = path.join(this.wasmDir, `${moduleName}.wasm`);
    try {
      const buffer = await fs.readFile(filePath);
      return buffer;
    } catch (error) {
      logger.error(`Error loading WebAssembly module ${moduleName}:`, error);
      throw new Error('Failed to load WebAssembly module');
    }
  }

  async updateModule(moduleName, newModuleBuffer) {
    const filePath = path.join(this.wasmDir, `${moduleName}.wasm`);
    try {
      await fs.writeFile(filePath, newModuleBuffer);
      logger.info(`WebAssembly module ${moduleName} updated successfully`);
    } catch (error) {
      logger.error(`Error updating WebAssembly module ${moduleName}:`, error);
      throw new Error('Failed to update WebAssembly module');
    }
  }

  async listModules() {
    try {
      const files = await fs.readdir(this.wasmDir);
      return files.filter(file => path.extname(file) === '.wasm');
    } catch (error) {
      logger.error('Error listing WebAssembly modules:', error);
      throw new Error('Failed to list WebAssembly modules');
    }
  }
}

module.exports = new WebAssemblyService();

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs').promises;
const WebAssemblyModule = require('../models/WebAssemblyModule');
const logger = require('../utils/logger');

class WasmWatcher {
  constructor(wasmDir) {
    this.wasmDir = wasmDir;
    this.watcher = null;
  }

  start() {
    this.watcher = chokidar.watch(this.wasmDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    this.watcher
      .on('add', (filepath) => this.handleNewFile(filepath))
      .on('change', (filepath) => this.handleFileChange(filepath))
      .on('unlink', (filepath) => this.handleFileRemove(filepath));

    logger.info(`Wasm watcher started for directory: ${this.wasmDir}`);
  }

  async handleNewFile(filepath) {
    if (path.extname(filepath) === '.wasm') {
      try {
        const name = path.basename(filepath, '.wasm');
        const existingModule = await WebAssemblyModule.findOne({ name });
        
        if (!existingModule) {
          const newModule = new WebAssemblyModule({
            name,
            description: `WebAssembly module: ${name}`,
            version: '1.0.0',
            author: 'System',
            filePath: filepath
          });
          await newModule.save();
          logger.info(`New WebAssembly module added: ${name}`);
        }
      } catch (error) {
        logger.error(`Error handling new WebAssembly file: ${filepath}`, error);
      }
    }
  }

  async handleFileChange(filepath) {
    if (path.extname(filepath) === '.wasm') {
      try {
        const name = path.basename(filepath, '.wasm');
        const existingModule = await WebAssemblyModule.findOne({ name });
        
        if (existingModule) {
          existingModule.version = (parseFloat(existingModule.version) + 0.1).toFixed(1);
          await existingModule.save();
          logger.info(`WebAssembly module updated: ${name}`);
        } else {
          await this.handleNewFile(filepath);
        }
      } catch (error) {
        logger.error(`Error handling WebAssembly file change: ${filepath}`, error);
      }
    }
  }

  async handleFileRemove(filepath) {
    if (path.extname(filepath) === '.wasm') {
      try {
        const name = path.basename(filepath, '.wasm');
        await WebAssemblyModule.deleteOne({ name });
        logger.info(`WebAssembly module removed: ${name}`);
      } catch (error) {
        logger.error(`Error handling WebAssembly file removal: ${filepath}`, error);
      }
    }
  }
}

module.exports = WasmWatcher;


const mongoose = require('mongoose');

const WebAssemblyModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  version: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('WebAssemblyModule', WebAssemblyModuleSchema);

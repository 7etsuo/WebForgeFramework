const mongoose = require('mongoose');

const WebAssemblyModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: String,
  version: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.Mixed,  // This allows both ObjectId and String
    required: true,
    index: true
  },
  filePath: {
    type: String,
    required: true
  },
}, { timestamps: true });

WebAssemblyModuleSchema.index({ createdAt: 1, updatedAt: 1 });

module.exports = mongoose.model('WebAssemblyModule', WebAssemblyModuleSchema);



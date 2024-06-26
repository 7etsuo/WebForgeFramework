const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('WebAssembly Module', function() {
  let wasmModule;

  before(async function() {
    this.timeout(5000);

    const wasmPath = path.join(__dirname, '../build/example.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
      }
    });

    global.Module = wasmModule.instance.exports;
  });

  it('should add two numbers correctly', function() {
    assert.strictEqual(Module._add(2, 3), 5);
  });
});


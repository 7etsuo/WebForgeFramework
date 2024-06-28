# WebForge WebAssembly Documentation

## Overview

The WebAssembly component of WebForge allows for the creation, management, and execution of WebAssembly modules. These modules are compiled from C/C++ code and can be dynamically loaded and run in the browser, providing high-performance computations.

## WebAssembly Module Structure

Each WebAssembly module in WebForge consists of:
1. C/C++ source code
2. Compiled WebAssembly binary (`.wasm` file)
3. Metadata stored in the database (name, description, version, etc.)

## Compilation Process

WebAssembly modules are compiled using Emscripten. The process is automated using a build script:

1. Place C/C++ source files in the `wasm/src/` directory
2. Use the `compile-wasm.sh` script to compile the code:
   ```
   ./wasm/compile-wasm.sh your_file.c
   ```
3. The compiled `.wasm` file is placed in `wasm/build/`

## Example Module: Add and Subtract

Two example modules are provided: `add.c` and `subtract.c`.

### add.c
```c
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) 
{
    return a + b;
}
```

### subtract.c
```c
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int subtract(int a, int b) 
{
    return a - b;
}
```

These modules export simple arithmetic functions that can be called from JavaScript.

## Module Management

The backend provides API endpoints for managing WebAssembly modules:
- Listing available modules
- Retrieving a specific module
- Uploading new modules
- Updating existing modules

## WebAssembly Watcher

The `wasmWatcher.js` service monitors the WebAssembly build directory for changes:
- Detects new `.wasm` files and adds them to the database
- Updates module metadata when existing files are modified
- Removes modules from the database when files are deleted

## Frontend Integration

The frontend loads and executes WebAssembly modules as follows:

1. Fetch the `.wasm` file from the server
2. Instantiate the WebAssembly module
3. Access and execute the module's exported functions

Example:
```javascript
const loadModule = async (moduleName) => {
  const moduleData = await authService.getWasmModule(moduleName);
  const { instance } = await WebAssembly.instantiate(moduleData);
  return instance.exports;
};

const runFunction = (module, funcName, ...args) => {
  return module[funcName](...args);
};
```

## Best Practices

1. Keep WebAssembly modules focused on performance-critical tasks
2. Use the `EMSCRIPTEN_KEEPALIVE` macro to ensure functions are exported
3. Prefer simple data types for function parameters and return values
4. Implement proper error handling in both C/C++ and JavaScript code

## Testing WebAssembly Modules

1. Unit tests for C/C++ code can be written using a framework like Google Test
2. Integration tests can be written in JavaScript to test the compiled WebAssembly modules
3. Use tools like Emscripten's `emrun` to test modules in a browser-like environment

## Security Considerations

1. Validate and sanitize all inputs before passing them to WebAssembly functions
2. Implement proper access controls to prevent unauthorized access to modules
3. Regularly update Emscripten and related tools to address potential vulnerabilities

## Performance Optimization

1. Use appropriate data types to minimize memory usage
2. Leverage WebAssembly's linear memory for large data sets
3. Profile your WebAssembly code to identify and optimize bottlenecks

## Future Enhancements

1. Support for additional programming languages (e.g., Rust)
2. Implementation of a WebAssembly System Interface (WASI) for broader capabilities
3. Integration with WebAssembly garbage collection proposal for easier memory management

This WebAssembly setup provides a flexible and powerful way to integrate high-performance computations into the WebForge application while maintaining clear separation from the frontend and backend components.


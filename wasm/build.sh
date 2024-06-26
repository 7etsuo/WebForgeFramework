#!/bin/bash

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Compile the C file to WebAssembly
emcc src/sample.c -s WASM=1 -s EXPORTED_FUNCTIONS='["_add", "_subtract"]' -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' -o build/sample.js

echo "Compilation complete. Output files are in the 'build' directory."

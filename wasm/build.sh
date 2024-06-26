#!/bin/bash

cd "$(dirname "$0")/src"

for file in *.c; do
    if [ -f "$file" ]; then
        name="${file%.*}"
        emcc "$file" -s WASM=1 -s EXPORTED_FUNCTIONS="['_add']" -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" -o "../build/${name}.js"
        echo "Compiled $file to ${name}.wasm and ${name}.js"
    fi
done
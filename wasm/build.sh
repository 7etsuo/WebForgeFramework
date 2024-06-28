#!/bin/bash

# Ensure we're in the correct directory
cd "$(dirname "$0")"

# Create build directory if it doesn't exist
mkdir -p build

# Function to extract function names from a C file
extract_functions() {
    grep -Po '(?<=EMSCRIPTEN_KEEPALIVE\s+)\w+(?=\s*\()' "$1" | tr '\n' ',' | sed 's/,$//'
}

# Debugging: Display the contents of the C file
echo "Contents of the source file:"
cat src/example.c

# Compile all .c files in the src directory
for c_file in src/*.c; do
    if [ -f "$c_file" ]; then
        base_name=$(basename "$c_file" .c)

        # Extract functions
        functions=$(extract_functions "$c_file")

        echo "Processing $c_file..."
        echo "Extracted functions: '$functions'"

        if [ -n "$functions" ]; then
            echo "Compiling $c_file with exported functions: $functions"
            emcc "$c_file" \
                -s WASM=1 \
                -s EXPORTED_FUNCTIONS="[$(echo "$functions" | sed 's/\([^,]*\)/\"_\1\"/g')]" \
                -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]' \
                -o "build/$base_name.js"
            echo "Compiled $base_name. Output files are in the 'build' directory."
        else
            echo "No EMSCRIPTEN_KEEPALIVE functions found in $c_file. Compiling without exports."
            emcc "$c_file" \
                -s WASM=1 \
                -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]' \
                -o "build/$base_name.js"
        fi
    else
        echo "No C files found in src directory."
    fi
done

echo "All compilations complete."


# Makefile to compile C files in src/ to WebAssembly using emcc

# Directories
SRC_DIR := src
BUILD_DIR := build

# Compiler
EMCC := emcc

# Compiler flags
CFLAGS := -s WASM=1 -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]'

# Source files and object files
SRC_FILES := $(wildcard $(SRC_DIR)/*.c)
OBJ_FILES := $(patsubst $(SRC_DIR)/%.c, $(BUILD_DIR)/%.js, $(SRC_FILES))

# Default target
all: $(OBJ_FILES)

# Rule to compile each .c file to .js and .wasm
$(BUILD_DIR)/%.js: $(SRC_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(EMCC) $< $(CFLAGS) -o $@

# Clean build directory
clean:
	rm -rf $(BUILD_DIR)/*

# Phony targets
.PHONY: all clean


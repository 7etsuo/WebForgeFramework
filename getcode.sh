#!/bin/bash

# Find all .js, .html, .css, and .md files, excluding node_modules and hidden directories
find . -type f \( -name "*.js" -o -name "*.html" -o -name "*.c" -o -name "*.h" -o -name "Makefile" -o -name "*.css" -o -name "*.md" \) -not -path '*/node_modules/*' -not -path '*/.*' | while read -r file; do
  # Print the file header
  echo -e "\n\n--- $file ---\n"
  # Print the contents of the file
  cat "$file"
done > all_source_code.txt


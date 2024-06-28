#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int subtract(int a, int b) 
{
    return a - b;
}


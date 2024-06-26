import React, { useState, useEffect } from 'react';

function Home() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWasm() {
      try {
        const response = await fetch('/wasm/sample.wasm');
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes);

        // Assuming your WASM module has an 'add' function
        const sum = instance.exports.add(5, 3);
        setResult(sum);
      } catch (err) {
        setError('Failed to load WebAssembly module');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWasm();
  }, []);

  if (isLoading) return <div>Loading WebAssembly module...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome to WebForge</h1>
      <p>This is the home page. WebAssembly modules are loaded here.</p>
      <p>Result of 5 + 3 using WebAssembly: {result}</p>
    </div>
  );
}

export default Home;

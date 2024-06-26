import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModuleList() {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('/api/wasm/modules', {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        setModules(response.data);
      } catch (err) {
        setError('Failed to fetch WebAssembly modules');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModules();
  }, []);

  if (isLoading) return <div>Loading modules...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>WebAssembly Modules</h2>
      <ul>
        {modules.map((module, index) => (
          <li key={index}>{module}</li>
        ))}
      </ul>
    </div>
  );
}

export default ModuleList;

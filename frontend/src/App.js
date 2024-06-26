import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ModuleList from './components/ModuleList';
import './App.css';
const authService = require('./services/authService');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/modules">Modules</Link></li>
            {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
            {isAuthenticated && <li><button onClick={handleLogout}>Logout</button></li>}
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
          />
          <Route
            path="/modules"
            element={isAuthenticated ? <ModuleList /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

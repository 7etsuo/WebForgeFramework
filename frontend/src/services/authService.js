const axios = require('axios');

const API_URL = '/api'; // Using relative path due to proxy setting in package.json

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  refreshToken: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post(`${API_URL}/token`, { token: user.refreshToken });
      if (response.data.accessToken) {
        user.accessToken = response.data.accessToken;
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  logout: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.delete(`${API_URL}/logout`, { data: { token: user.refreshToken } });
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

module.exports = authService;

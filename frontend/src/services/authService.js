import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Adjust this to match your backend URL

const authService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

export default authService;

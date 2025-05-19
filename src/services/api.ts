import axios from 'axios';

// Setup axios instance
const api = axios.create({
  baseURL: 'http://localhost:5002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('electra-user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 
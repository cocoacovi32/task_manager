import axios from 'axios';

// Hardcode the Railway backend URL for production
const API_URL = 'https://taskmanager-production-617c.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

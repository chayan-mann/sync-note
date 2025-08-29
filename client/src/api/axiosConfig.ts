import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Your backend URL
});

export default apiClient;
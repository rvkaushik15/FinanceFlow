import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure this matches backend
    withCredentials: true, // For cookies
});

export default api;

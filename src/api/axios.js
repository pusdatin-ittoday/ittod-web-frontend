import axios from 'axios';
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true, // if using cookies for auth
});

export default instance; 
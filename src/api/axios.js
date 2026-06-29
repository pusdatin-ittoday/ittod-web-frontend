import axios from 'axios';
const instance = axios.create({
    withCredentials: true, // if using cookies for auth
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default instance; 
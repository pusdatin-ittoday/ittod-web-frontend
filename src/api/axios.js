import axios from 'axios';
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // if using cookies for auth
});

export default instance; 
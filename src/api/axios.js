import axios from 'axios';
import { attachDedupeInterceptor } from '../utils/apiDedupe';

const instance = axios.create({
    withCredentials: true, // if using cookies for auth
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

attachDedupeInterceptor(instance);

export default instance;
 
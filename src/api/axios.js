import axios from 'axios';
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // if using cookies for auth
});

export default instance;
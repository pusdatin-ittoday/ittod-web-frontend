import axios from 'axios';
axios.defaults.withCredentials = true;
const instance = axios.create({
    withCredentials: true, // if using cookies for auth
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
    },
});

export default instance;
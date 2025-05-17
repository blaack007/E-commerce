import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || `https://dummyjson.com`;

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

export default axiosInstance;



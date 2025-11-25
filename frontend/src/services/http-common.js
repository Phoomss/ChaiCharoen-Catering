import axios from 'axios'

const defaultOptions = {
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
};

// Create instance
let instance = axios.create(defaultOptions);

// Set the AUTH token for any request
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
});

export default instance;
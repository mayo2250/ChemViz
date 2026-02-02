import axios from 'axios';

const API_URL = 'https://chemviz-backend-nqg2.onrender.com/api';

// Create an axios instance to handle headers automatically
const api = axios.create({
    baseURL: API_URL,
});

// Add the token to every request if we have it
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (username, password) => {
    const res = await api.post('/token/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    return res.data;
};

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const getHistory = async () => {
    return await api.get('/history/');
};

export const downloadReport = async () => {
    const response = await api.get('/report/', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ChemViz_Report.pdf');
    document.body.appendChild(link);
    link.click();
};
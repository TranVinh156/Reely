// import axios from "axios";
// import { refreshToken } from "../api/auth";

// const API_URL = 'http://localhost:8000'

// const axiosClient = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     withCredentials: true
// })

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

// axiosClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axiosClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then(token => {
//                         originalRequest.headers.Authorization = `Bearer ${token}`;
//                         return axiosClient(originalRequest);
//                     })
//                     .catch(err => Promise.reject(err));
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 const newAccessToken = await refreshToken();
//                 localStorage.setItem('accessToken', newAccessToken);

//                 processQueue(null, newAccessToken);

//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return axiosClient(originalRequest);
//             } catch (refreshError) {
//                 processQueue(refreshError, null);

//                 localStorage.removeItem('accessToken');
//                 window.location.href = '/login';

//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosClient
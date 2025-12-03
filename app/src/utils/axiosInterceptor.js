import axios from 'axios';
import { authService } from '@/utils/authService';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined. Please check your .env file.');
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.request.use(
    config => {
      console.log('[Axios] Request:', config.method.toUpperCase(), config.url);
      const token = authService.getToken();
      const isAuthEndpoint = config.url.includes('/auth/login') ||
                            config.url.includes('/auth/register');

      if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      console.error('[Axios] Request error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => {
      console.log('[Axios] Response:', response.status, response.config.url);
      return response;
    },
    async error => {
      console.log('[Axios] Response error:', error.response?.status, error.config?.url);
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/register') &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        if (isRefreshing) {
          console.log('[Axios] Token refresh in progress, queuing request');
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              console.log('[Axios] Retrying queued request with new token');
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              console.error('[Axios] Queued request failed:', err);
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        console.log('[Axios] Starting token refresh');

        try {
          const response = await axiosInstance.post('/auth/refresh');
          const { access_token } = response.data.data;

          console.log('[Axios] Token refresh successful');
          authService.setToken(access_token);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;

          processQueue(null, access_token);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('[Axios] Token refresh failed:', refreshError);
          processQueue(refreshError, null);
          authService.clearAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          console.log('[Axios] Token refresh process ended');
        }
      }

      return Promise.reject(error);
    }
  );
};

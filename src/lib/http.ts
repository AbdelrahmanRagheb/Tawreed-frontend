import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }

    if (!error.response) {
      const msg = 'Unable to connect to the server. Please check your internet connection.';
      (error as any).userMessage = msg;
      window.location.href = `/error?code=network&message=${encodeURIComponent(msg)}`;
      return Promise.reject(error);
    }

    const status = error.response.status;
    const serverMsg = error.response.data?.message;

    if (status >= 500) {
      (error as any).statusCode = status;
      (error as any).userMessage = serverMsg || 'Something went wrong on our end. Please try again later.';
    } else if (status === 403) {
      (error as any).userMessage = serverMsg || 'You do not have permission to perform this action.';
    } else if (status === 404) {
      (error as any).userMessage = serverMsg || 'The requested resource was not found.';
    } else {
      (error as any).userMessage = serverMsg || 'Something went wrong.';
    }

    return Promise.reject(error);
  }
);

export default http;
export { BASE_URL };

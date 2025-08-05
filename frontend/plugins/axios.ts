import axios from 'axios';
// @ts-ignore
import { defineNuxtPlugin } from '#imports';

// Create and configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000', // You can update this in nuxt.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage when in browser context
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // Add token to headers if it exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Simple redirect for now
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      axios: api
    }
  };
});

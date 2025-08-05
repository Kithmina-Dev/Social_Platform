import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getError: (state) => state.error,
    isLoading: (state) => state.loading,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Call your login API
        const response = await axios.post('/api/auth/login', {
          email,
          password
        });
        
        this.token = response.data.token;
        this.user = response.data.user;
        
        // Store token in localStorage (browser only)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token);
        }
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed. Please check your credentials.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Call your register API
        const response = await axios.post('/api/auth/register', {
          username,
          email,
          password
        });
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed. Please try again.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCurrentUser() {
      this.loading = true;
      
      try {
        // Call your current user API
        const response = await axios.get('/api/auth/me');
        
        this.user = response.data;
        return this.user;
      } catch (error: any) {
        // If API call fails, clear auth state
        this.token = null;
        this.user = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        delete axios.defaults.headers.common['Authorization'];
        
        this.error = error.response?.data?.message || 'Session expired. Please login again.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      this.loading = true;
      
      try {
        // Call your logout API (if needed)
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear auth state regardless of API success
        this.token = null;
        this.user = null;
        this.error = null;
        
        // Clear localStorage (browser only)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        
        // Remove axios header
        delete axios.defaults.headers.common['Authorization'];
        
        this.loading = false;
      }
    },
    
    updateUserProfile(userData) {
      // Update local user data
      if (this.user) {
        this.user = {
          ...this.user,
          ...userData
        };
      }
    },
    
    initFromStorage() {
      // Try to initialize state from localStorage (on app start, browser only)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        if (token) {
          this.token = token;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch current user data
          this.fetchCurrentUser().catch(() => {
            // If fetching user fails, the fetchCurrentUser method will clear the auth state
          });
        }
      }
    }
  }
});

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig, useNuxtApp } from "nuxt/app";

// Define API function type
type ApiFunction = <T>(url: string, options?: any) => Promise<T>;

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  // Actions
  const login = async (credentials: LoginCredentials) => {
    try {
      const { $api } = useNuxtApp();
      const response = await ($api as ApiFunction)<AuthResponse>(
        "/auth/login",
        {
          method: "POST",
          body: credentials,
        }
      );

      // Check if the response is a NestJS standard response with a data property
      const responseData =
        "data" in response ? (response as any).data : response;
      token.value = responseData.accessToken;
      user.value = responseData.user;

      // Store token in localStorage
      localStorage.setItem("auth_token", responseData.accessToken);

      return response;
    } catch (err: any) {
      error.value = err.data?.message || "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log("Starting registration request with credentials:", {
        ...credentials,
      });
      const { $api } = useNuxtApp();
      console.log("Using API endpoint:", "/auth/register");

      // Use the api plugin instead of direct fetch
      const response = await ($api as ApiFunction)<AuthResponse>(
        "/auth/register",
        {
          method: "POST",
          body: credentials,
          onRequest({ request, options }) {
            console.log("Request options:", {
              ...options,
              body: {
                ...(options.body as any),
                password: options.body ? "***" : undefined,
              },
            });
          },
          onRequestError({ request, options, error }) {
            console.error("Request error:", error);
          },
          onResponse({ request, response, options }) {
            console.log("Response status:", response.status);
            console.log("Response body:", response._data);
          },
          onResponseError({ request, response, options, error }) {
            console.error("Response error:", error);
            console.error("Response status:", response?.status);
            console.error("Response body:", response?._data);
          },
        }
      );

      console.log("Registration successful:", response);
      // Check if the response is a NestJS standard response with a data property
      const responseData =
        "data" in response ? (response as any).data : response;
      token.value = responseData.accessToken;
      user.value = responseData.user;

      // Store token in localStorage
      localStorage.setItem("auth_token", responseData.accessToken);

      return response;
    } catch (err: any) {
      console.error("Registration failed in auth store:", err);
      error.value = err.data?.message || "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    error.value = null;

    // Remove token from localStorage
    localStorage.removeItem("auth_token");
  };

  const initializeAuth = () => {
    // Check for stored token on app initialization
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      token.value = storedToken;
      // Optionally validate token with backend
      // fetchUserProfile()
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { $api } = useNuxtApp();
      const response = await ($api as ApiFunction)<User>("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      user.value = response;
    } catch (err: any) {
      // If token is invalid, clear auth state
      logout();
    }
  };
  // Initialize auth state on store creation
  initializeAuth();
  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
    fetchUserProfile,
  };
});

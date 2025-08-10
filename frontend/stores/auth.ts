import { defineStore } from "pinia";
import { useAuth as useAuthComposable } from "~/composables/useAuth";

export const useAuthStore = defineStore("auth", () => {
  const {
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
    initializeAuth,
  } = useAuthComposable();

  
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
    initializeAuth,
  };
});

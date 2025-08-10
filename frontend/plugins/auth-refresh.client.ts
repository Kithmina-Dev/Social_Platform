import { useAuthStore } from "~/stores/auth";
import { defineNuxtPlugin } from "#app";

/**
 * This plugin intercepts 401 Unauthorized responses and attempts to refresh
 * the authentication state before proceeding.
 */
export default defineNuxtPlugin(({ hook }) => {
  const authStore = useAuthStore();

  // Add hook for API response errors
  hook("app:error", (error: any) => {
    // Check if this is an API error with 401 status
    if (error?.statusCode === 401 || error?.response?.status === 401) {
      console.log(
        "Auth-refresh plugin: Detected 401 Unauthorized, attempting to refresh auth state"
      );

      // Don't immediately log out - try to refresh the auth state
      // This prevents unnecessary logouts when token might still be valid
      authStore.initializeAuth().catch((err: any) => {
        console.error(
          "Auth-refresh plugin: Failed to refresh auth state:",
          err
        );
        // Only logout if we couldn't refresh the auth state
        authStore.logout();
      });
    }
  });

  // Hook for fetch/fetch module responses
  hook("vue:error", (error: any, instance: any, info: any) => {
    // Check for 401 status in different error formats
    const isUnauthorized =
      error?.status === 401 ||
      error?.response?.status === 401 ||
      (typeof error === "object" && error?.message?.includes("401"));

    if (isUnauthorized) {
      console.log(
        "Auth-refresh plugin: Detected 401 in Vue error, attempting to refresh auth state"
      );

      authStore.initializeAuth().catch((err: any) => {
        console.error(
          "Auth-refresh plugin: Failed to refresh auth state:",
          err
        );
        authStore.logout();
      });
    }
  });

  console.log("Auth refresh plugin initialized");
});

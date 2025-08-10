import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Check if user is already authenticated before initializing
  if (authStore.isAuthenticated && authStore.user) {
    console.log(
      "Guest middleware: User is already authenticated, redirecting to explore"
    );
    return navigateTo("/explore");
  }

  // Client-side handling with async/await
  if (process.client) {
    const storedToken = localStorage.getItem("auth_token");

    // Special handling for login page - don't auto-redirect
    if (storedToken && to.path === "/login") {
      console.log(
        "Guest middleware: Token found in storage, but letting user decide to login"
      );
      // We won't automatically initialize auth or redirect from login page
      // This lets users re-login if needed
      return;
    }

    // For other guest pages (register, forgot password), check if we should redirect
    if (storedToken) {
      console.log(
        "Guest middleware: Found token, validating before redirecting"
      );

      try {
        // Try to initialize auth with the stored token
        const token = await authStore.initializeAuth();

        // If initialization succeeded (token is valid and we have user data)
        if (token && authStore.user) {
          console.log(
            "Guest middleware: Token is valid, redirecting to explore"
          );
          return navigateTo("/explore");
        }
      } catch (error) {
        console.error(
          "Guest middleware: Error during auth initialization:",
          error
        );
        // If there was an error initializing auth, we'll let the user continue to the guest page
      }
    }
  } else {
    // Server-side rendering - check auth cookie
    const authCookie = useCookie("auth-token");

    if (authCookie.value) {
      // If there's a cookie and we're not on login page, assume auth and redirect
      if (to.path !== "/login") {
        return navigateTo("/explore");
      }
    }
  }
});

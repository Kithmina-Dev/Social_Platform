export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Skip auth check for login and registration pages to prevent loops
  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  if (publicPages.includes(to.path)) {
    return; // Allow access to public pages
  }

  // Client-side handling
  if (process.client) {
    // Check for token in localStorage
    const hasToken = localStorage.getItem("auth_token");

    if (!hasToken) {
      console.log(
        "Auth middleware: No token found in localStorage, redirecting to login"
      );
      return navigateTo("/login");
    }

    // Don't immediately redirect if a token exists
    // This prevents the login-redirect flicker on page refresh
    if (hasToken) {
      // Set the token value in the store right away to ensure isAuthenticated is true
      authStore.token = hasToken;

      // Initialize auth state asynchronously
      // Using the newer approach with a promise instead of setTimeout
      if (!authStore.user) {
        console.log(
          "Auth middleware: Token found but no user data, initializing auth"
        );
        try {
          // Wait for initializeAuth to complete (it returns the token value)
          const token = await authStore.initializeAuth();

          if (!token) {
            console.log(
              "Auth middleware: Token validation failed during initialization"
            );
            return navigateTo("/login");
          }
        } catch (error) {
          console.error(
            "Auth middleware: Error during auth initialization:",
            error
          );
          // We'll still continue to the page as we have a token
          // The app can handle fetching user data later
        }
      }

      console.log(
        "Auth middleware: Token validated, continuing to requested page"
      );
      return; // Continue to the requested page
    }
  } else {
    // Server-side rendering - check for auth cookie
    const authCookie = useCookie("auth-token");

    if (!authCookie.value && !authStore.isAuthenticated) {
      console.log(
        "Auth middleware (SSR): No auth cookie found, redirecting to login"
      );
      return navigateTo("/login");
    }

    // If we have a cookie but no user data, set the token to ensure isAuthenticated is true
    if (authCookie.value && !authStore.user) {
      authStore.token = authCookie.value;
    }
  }

  // Final check - if still not authenticated after all checks, redirect
  if (!authStore.isAuthenticated) {
    console.log("Auth middleware: Final check failed, redirecting to login");
    return navigateTo("/login");
  }
});

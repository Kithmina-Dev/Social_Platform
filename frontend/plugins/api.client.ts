import {
  defineNuxtPlugin,
  navigateTo,
  useCookie,
  useRuntimeConfig,
} from "nuxt/app";

// API client plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Create API client instance
  const apiClient = $fetch.create({
    baseURL:
      typeof config.public.apiBaseUrl === "string"
        ? config.public.apiBaseUrl
        : "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
    // Add response transformation for NestJS standard response
    async onResponse({ response }) {
      if (
        response._data &&
        typeof response._data === "object" &&
        "data" in response._data
      ) {
        response._data = response._data.data;
      }
    },
    onRequest({ request, options }) {
      // Add auth token if available
      let tokenValue = null;

      // Check for token in cookie first
      const cookieToken = useCookie("auth-token");
      if (cookieToken.value) {
        tokenValue = cookieToken.value;
      } else if (process.client) {
        const localStorageToken = localStorage.getItem("auth_token");
        if (localStorageToken) {
          tokenValue = localStorageToken;
        }
      }

      if (tokenValue) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenValue}`,
        } as any;
      }
    },
    onResponseError({ request, response, error }) {
      // Log errors
      console.error("API Error:", {
        request,
        status: response?.status,
        statusText: response?.statusText,
        data: response?._data,
        error,
      });

      // Get the current URL to check if we're on auth pages
      const isAuthPath =
        process.client &&
        window.location.pathname &&
        (window.location.pathname.includes("/login") ||
          window.location.pathname.includes("/register"));

      if (response?.status === 401 && !isAuthPath) {
        navigateTo("/login");
      }
    },
  });

  return {
    provide: {
      api: apiClient,
    },
  };
});

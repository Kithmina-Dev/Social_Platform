import { defineNuxtPlugin, navigateTo, useCookie, useRuntimeConfig } from "nuxt/app";

// API client plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Create API client instance
  const apiClient = $fetch.create({
    baseURL: typeof config.public.apiBaseUrl === 'string' ? config.public.apiBaseUrl : "http://localhost:3001/api",
    headers: {
      "Content-Type": "application/json",
    },
    // Add response transformation for NestJS standard response
    async onResponse({ response }) {
      // If the response contains a NestJS standard format with data property, extract it
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
      const token = useCookie("auth-token");
      if (token.value) {
        // Cast to any to avoid TS errors with headers
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        } as any;
      }
    },
    onResponseError({ response }) {
      // Handle common errors
      if (response.status === 401) {
        // Redirect to login if unauthorized
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

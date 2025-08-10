import { useRuntimeConfig } from "nuxt/app";
import { useAuth } from "./useAuth";

interface ApiOptions {
  method?: string;
  body?: any;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  onRequest?: (context: any) => void;
  onResponse?: (context: any) => void;
  onRequestError?: (context: any) => void;
  onResponseError?: (context: any) => void;
}

// Composable for API interactions
export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL =
    (config.public.apiBaseUrl as string) || "http://localhost:3000";

  // Get auth state for token inclusion in requests
  const { token } = useAuth();

  /**
   * @param endpoint
   * @param options
   * @returns
   */
  const authRequest = async <T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }

    try {
      return await $fetch<T>(endpoint, {
        baseURL,
        method: (options.method as any) || "GET",
        body: options.body,
        params: options.params,
        headers,
        onRequest: options.onRequest,
        onResponse: options.onResponse,
        onRequestError: options.onRequestError,
        onResponseError: options.onResponseError,
      });
    } catch (error: any) {
      console.error(`API request failed: ${endpoint}`, error);

      // Enhanced error handling
      if (error.response?.status === 401) {
        // Handle unauthorized - could trigger logout or refresh token flow
        console.warn("Authentication error in API request");
      }

      throw error;
    }
  };

  // Make a GET request
  const get = <T>(
    endpoint: string,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => {
    return authRequest<T>(endpoint, { ...options, method: "GET" });
  };

  // Make a POST request
  const post = <T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => {
    return authRequest<T>(endpoint, { ...options, method: "POST", body: data });
  };

  // Make a PUT request
  const put = <T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => {
    return authRequest<T>(endpoint, { ...options, method: "PUT", body: data });
  };

  // Make a PATCH request
  const patch = <T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => {
    return authRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data,
    });
  };

  // Make a DELETE request
  const del = <T>(
    endpoint: string,
    options: Omit<ApiOptions, "method"> = {}
  ) => {
    return authRequest<T>(endpoint, { ...options, method: "DELETE" });
  };

  // Upload a file with FormData
  const uploadFile = <T>(
    endpoint: string,
    formData: FormData,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => {
    return authRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        ...options.headers,
      },
    });
  };

  return {
    // Base methods
    request: authRequest,

    // Convenience methods for different HTTP verbs
    get,
    post,
    put,
    patch,
    delete: del,
    uploadFile,

    // Base URL for direct usage if needed
    baseURL,
  };
};

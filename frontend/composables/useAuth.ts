import { ref, computed } from "vue";
import { useRuntimeConfig } from "nuxt/app";

// Define types
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  website?: string;
  role?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
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

// Create a global state using useState (Nuxt 3 method)
export const useAuth = () => {
  // Use Nuxt's built-in state management for SSR-friendly state
  const user = useState<User | null>("auth_user", () => null);
  const token = useState<string | null>("auth_token", () => null);
  const isLoading = useState<boolean>("auth_loading", () => false);
  const error = useState<string | null>("auth_error", () => null);

  // Computed properties
  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  // Login user with credentials
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log("Attempting login with credentials:", {
        username: credentials.username,
        password: "****",
      });

      const { $api } = useNuxtApp();
      const config = useRuntimeConfig();
      console.log("API Base URL:", config.public.apiBaseUrl);

      const response = await $fetch<AuthResponse>("/api/auth/login", {
        baseURL: config.public.apiBaseUrl as string,
        method: "POST",
        body: credentials,
      });

      const responseData =
        "data" in response ? (response as any).data : response;

      console.log("Login response data:", responseData);

      if (!responseData.accessToken) {
        throw new Error("No access token returned from server");
      }

      token.value = responseData.accessToken;

      if (responseData.user) {
        user.value = responseData.user;
        console.log("User data from login:", user.value);
      } else {
        console.log("No user data in login response, fetching profile");
        await fetchUserProfile();
      }

      // Store token based on remember me preference
      if (process.client) {
        // Always store in localStorage for immediate session
        localStorage.setItem("auth_token", responseData.accessToken);

        // Store current timestamp for token age tracking
        localStorage.setItem(
          "token_timestamp",
          new Date().getTime().toString()
        );

        // If rememberMe is true, store in a more persistent way
        if (credentials.rememberMe) {
          console.log("Remember Me enabled, setting persistent auth");
          localStorage.setItem("remember_auth", "true");
        } else {
          localStorage.removeItem("remember_auth");
          console.log("Remember Me disabled, using session-only auth");
        }
      }

      // Set cookie for SSR compatibility with appropriate expiry
      const maxAge = credentials.rememberMe
        ? 60 * 60 * 24 * 30 // 30 days for remember me
        : 60 * 60 * 24; // 24 hours for regular session

      const authCookie = useCookie("auth-token", {
        maxAge: maxAge,
        path: "/",
      });
      authCookie.value = responseData.accessToken;

      return response;
    } catch (err: any) {
      console.error("Login failed:", err);

      //Handling for network errors and others
      if (err.message && err.message.includes("fetch")) {
        error.value =
          "Network error: Unable to connect to the server. Please check if the backend server is running.";
      } else if (err.status === 502) {
        error.value =
          "Bad Gateway: The server is unreachable or not responding correctly.";
      } else if (err.status === 401) {
        error.value = "Invalid username or password. Please try again.";
      } else if (err.status === 404) {
        error.value =
          "The login service is not available. Please try again later.";
      } else {
        error.value = err.data?.message || err.message || "Login failed";
      }

      throw new Error(error.value || "An error occurred during login");
    } finally {
      isLoading.value = false;
    }
  };

  // Register a new user
  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log("Starting registration request with credentials:", {
        ...credentials,
      });

      const config = useRuntimeConfig();

      // Use the api plugin instead of direct fetch
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        baseURL: config.public.apiBaseUrl as string,
        method: "POST",
        body: credentials,
      });

      //console.log("Registration successful:", response);

      // Check if the response is a NestJS standard response with a data property
      const responseData =
        "data" in response ? (response as any).data : response;

      token.value = responseData.accessToken;
      user.value = responseData.user;

      // Store token in localStorage and cookie
      if (process.client) {
        localStorage.setItem("auth_token", responseData.accessToken);
      }

      // Set cookie for SSR compatibility
      const authCookie = useCookie("auth-token", {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      authCookie.value = responseData.accessToken;

      return response;
    } catch (err: any) {
      console.error("Registration failed:", err);

      // Handle different types of errors including network errors
      if (err.message && err.message.includes("fetch")) {
        error.value =
          "Network error: Unable to connect to the server. Please check if the backend server is running.";
      } else if (err.status === 502) {
        error.value =
          "Bad Gateway: The server is unreachable or not responding correctly.";
      } else if (err.status === 409) {
        error.value =
          "This username or email is already taken. Please try another.";
      } else if (err.status === 400) {
        error.value = "Please check your information and try again.";
      } else {
        error.value = err.data?.message || err.message || "Registration failed";
      }

      throw new Error(error.value || "An error occurred during registration");
    } finally {
      isLoading.value = false;
    }
  };

  // Log out the user
  const logout = () => {
    user.value = null;
    token.value = null;
    error.value = null;

    if (process.client) {
      // Clear all auth-related localStorage items
      localStorage.removeItem("auth_token");
      localStorage.removeItem("remember_auth");
      localStorage.removeItem("token_timestamp");

      console.log("User logged out, all auth data cleared");
    }

    // Clear auth cookie
    const authCookie = useCookie("auth-token");
    authCookie.value = null;
  };

  // Initialize authentication state on page load
  const initializeAuth = async () => {
    // Check for stored token on app initialization
    if (process.client) {
      const storedToken = localStorage.getItem("auth_token");
      const remembered = localStorage.getItem("remember_auth") === "true";

      // Check for token expiry if not using "Remember Me"
      if (storedToken) {
        console.log(
          `Found stored token (Remember Me: ${remembered}), initializing auth`
        );

        // If not remembered, check when the token was stored
        if (!remembered) {
          const tokenTimestamp = localStorage.getItem("token_timestamp");
          const currentTime = new Date().getTime();

          if (tokenTimestamp) {
            // Check if token is older than 24 hours and not remembered
            const tokenAge = currentTime - parseInt(tokenTimestamp);
            const ONE_DAY = 24 * 60 * 60 * 1000;

            if (tokenAge > ONE_DAY) {
              console.log("Token expired (older than 24h), logging out");
              logout();
              return;
            }
          } else {
            // No timestamp, set one now
            localStorage.setItem("token_timestamp", currentTime.toString());
          }
        }

        // Token is valid according to our checks, proceed with auth
        token.value = storedToken;

        // Set the auth cookie as well for SSR
        const authCookie = useCookie("auth-token", {
          maxAge: remembered ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
          path: "/",
        });
        authCookie.value = storedToken;

        // Validate token with backend and get user profile
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error("Error during auth initialization:", error);
          // Don't log out immediately on error - we'll try to continue with the token we have
        }
      } else {
        console.log("No stored token found, user needs to login");
      }
    }

    return token.value;
  };

  // Fetch user profile with current authentication token
  const fetchUserProfile = async () => {
    try {
      // Check if we have a token
      if (!token.value) {
        console.warn("Attempting to fetch user profile without a token");
        return;
      }

      const config = useRuntimeConfig();
      console.log(
        "Fetching user profile with token:",
        token.value ? `${token.value.substring(0, 10)}...` : "No token"
      );

      const response = await $fetch<User>("/api/auth/profile", {
        baseURL: config.public.apiBaseUrl as string,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      // Check if response has a data wrapper (common NestJS pattern)
      const userData = "data" in response ? (response as any).data : response;

      // Ensure avatar URL is absolute if it's a relative path
      if (userData.avatar && userData.avatar.startsWith("/")) {
        // Get base URL from environment or use default backend URL
        const baseUrl = config.public.apiBaseUrl || "http://localhost:3000";
        userData.avatar = `${baseUrl}${userData.avatar}`;
        console.log("Converted avatar path to absolute URL:", userData.avatar);
      }

      user.value = userData;
      console.log("User profile loaded:", user.value);
    } catch (err: any) {
      console.error("Error fetching user profile:", err);

      // Check for specific error types
      if (err.status === 401) {
        // If token is invalid or expired, clear auth state
        console.log("Invalid or expired token, logging out");
        logout();
      } else if (err.status === 500) {
        console.log(
          "Server error when fetching profile, but keeping session active"
        );

        const isPrismaError =
          err.message?.includes("PrismaClientValidationError") ||
          err.data?.message?.includes("PrismaClientValidationError") ||
          err.message?.includes("id: undefined");

        if (isPrismaError) {
          console.log(
            "Detected Prisma client validation error (undefined ID). Using fallback method."
          );
          error.value =
            "Backend user lookup issue - using cached data instead.";
        } else {
          error.value =
            "Could not load profile data. Please try refreshing the page.";
        }

        // Use the token payload to extract basic user info
        if (token.value) {
          try {
            console.log("Attempting to extract user data from JWT token");
            const tokenParts = token.value.split(".");
            if (tokenParts.length === 3 && tokenParts[1]) {
              const tokenPayload = JSON.parse(atob(tokenParts[1]));
              console.log("Token payload:", {
                ...tokenPayload,
                exp: undefined,
                iat: undefined,
              });

              // Look for user ID in multiple potential fields
              const userId =
                tokenPayload.sub || tokenPayload.id || tokenPayload.userId;

              // Look for username in multiple potential fields
              const username =
                tokenPayload.username || tokenPayload.user?.username;

              if (userId && username) {
                console.log(
                  `Using JWT data, user ID: ${userId.substring(0, 8)}...`
                );
                user.value = {
                  id: userId,
                  username: username,
                  email:
                    tokenPayload.email ||
                    tokenPayload.user?.email ||
                    `${username}@example.com`,
                  avatar: tokenPayload.avatar || tokenPayload.user?.avatar,
                  // Add any other fields that your UI might need
                  createdAt:
                    tokenPayload.createdAt || tokenPayload.user?.createdAt,
                  displayName:
                    tokenPayload.displayName ||
                    tokenPayload.user?.displayName ||
                    username,
                  role: tokenPayload.role || tokenPayload.user?.role || "USER",
                };
                console.log("Created fallback user from token:", user.value);
              } else {
                console.warn(
                  "JWT token missing required fields (sub/id or username)"
                );
              }
            }
          } catch (e) {
            //console.error("Error extracting user data from token:", e);
          }
        }
      } else {
        // For other errors, default to logout
        console.log("Other error when fetching profile, logging out");
        logout();
      }
    }
  };

  // Initialize auth when on client side
  if (process.client) {
    initializeAuth();
  }

  // Return all the functionality and state
  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    currentUser,

    // Methods
    login,
    register,
    logout,
    fetchUserProfile,
    initializeAuth,
  };
};

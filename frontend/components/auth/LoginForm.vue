<template>
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      Do we know each other?
    </h2>

    <div
      v-if="backendError"
      class="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-3"
    >
      <i class="pi pi-exclamation-circle text-red-500 text-xl"></i>
      <div>
        <div class="font-medium">{{ getErrorTitle(backendError) }}</div>
        <div class="text-sm">{{ getErrorMessage(backendError) }}</div>
      </div>
    </div>

    <Form
      :validation-schema="loginSchema"
      @submit="handleLogin"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="space-y-4">
        <div class="space-y-2">
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Username <span class="text-red-500">*</span></label
          >
          <VeeField
            name="username"
            type="text"
            id="username"
            placeholder="Enter your username"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm"
          />
          <p v-if="errors?.username" class="mt-1 text-sm text-red-600">
            {{ errors.username }}
          </p>
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password <span class="text-red-500">*</span></label
          >
          <VeeField
            name="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm"
          />
          <p v-if="errors?.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me for 30 days
          </label>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          full-width
        >
          {{ isSubmitting ? "Signing In..." : "Sign In" }}
        </BaseButton>
      </div>
    </Form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Form, Field as VeeField } from "vee-validate";
import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "nuxt/app";
import { ref } from "vue";

// Auth store
const authStore = useAuthStore();
const backendError = ref<string | null>(null);
const rememberMe = ref(false);

// Validation schema
const loginSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  })
);
// Helper functions for error handling
const getErrorTitle = (error: string): string => {
  if (error.toLowerCase().includes("network error")) {
    return "Connection Error";
  } else if (error.toLowerCase().includes("invalid username or password")) {
    return "Authentication Failed";
  } else if (error.toLowerCase().includes("bad gateway")) {
    return "Server Error";
  } else if (
    error.toLowerCase().includes("internal server error") ||
    error.toLowerCase().includes("500")
  ) {
    return "Server Error";
  } else {
    return "Login Failed";
  }
};

const getErrorMessage = (error: string): string => {
  if (error.toLowerCase().includes("network error")) {
    return "Unable to connect to the server. Please make sure you have an internet connection and try again.";
  } else if (error.toLowerCase().includes("invalid username or password")) {
    return "The username or password you entered is incorrect. Please try again.";
  } else if (
    error.toLowerCase().includes("internal server error") ||
    error.toLowerCase().includes("500")
  ) {
    return "The server encountered an error processing your request. Please try again later or contact support.";
  } else if (error.toLowerCase().includes("bad gateway")) {
    return "The server is temporarily unavailable. Please try again in a few minutes.";
  } else if (
    error.toLowerCase().includes("internal server error") ||
    error.toLowerCase().includes("500")
  ) {
    return "The server encountered an error processing your request. Please try again later or contact support.";
  } else {
    return error || "An unexpected error occurred. Please try again.";
  }
};

// Handle login
const handleLogin = async (values: any) => {
  try {
    backendError.value = null;
    console.log(`Login attempt with Remember Me: ${rememberMe.value}`);

    await authStore.login({
      username: values.username,
      password: values.password,
      rememberMe: rememberMe.value,
    });


    await navigateTo("/explore");
  } catch (error: any) {
    console.error("Login failed:", error);
    backendError.value = error.message || "Login failed. Please try again.";
  }
};
</script>

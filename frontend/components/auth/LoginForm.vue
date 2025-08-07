<template>
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

    <Form
      :validation-schema="loginSchema"
      @submit="handleLogin"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="space-y-4">
        <BaseFormField
          name="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          required
          :error="errors?.username"
        />

        <BaseFormField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          :error="errors?.password"
        />

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

// Auth store
const authStore = useAuthStore();

// Validation schema
const loginSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  })
);

// Handle login
const handleLogin = async (values: any) => {
  try {
    await authStore.login({
      username: values.username,
      password: values.password,
    });

    // Redirect to home page after successful login
    await navigateTo("/explore");
  } catch (error: any) {
    console.error("Login failed:", error);
    // Error handling will be done by the store
  }
};
</script>

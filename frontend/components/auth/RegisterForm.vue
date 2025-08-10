<template>
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

    <div
      v-if="backendError"
      class="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-3"
    >
      <i class="pi pi-exclamation-circle text-red-500 text-xl"></i>
      <div>
        <div class="font-medium">Registration Failed</div>
        <div class="text-sm">{{ backendError }}</div>
      </div>
    </div>

    <Form
      :validation-schema="registerSchema"
      @submit="handleRegister"
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
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p v-if="errors?.username" class="mt-1 text-sm text-red-600">
            {{ errors.username }}
          </p>
        </div>

        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email <span class="text-red-500">*</span></label
          >
          <VeeField
            name="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p v-if="errors?.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
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
            class="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p v-if="errors?.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <div class="space-y-2">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password <span class="text-red-500">*</span></label
          >
          <VeeField
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p v-if="errors?.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <VeeField name="acceptTerms" v-slot="{ field }">
              <input
                type="checkbox"
                :checked="field.value"
                @input="
                  field.onChange(($event.target as HTMLInputElement).checked)
                "
                @blur="field.onBlur"
                id="acceptTerms"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </VeeField>
          </div>
          <div class="ml-3 text-sm">
            <label for="acceptTerms" class="text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-blue-600 hover:underline"
                >Terms of Service</a
              >
              <span class="text-red-500 ml-1">*</span>
            </label>
            <p v-if="errors?.acceptTerms" class="text-red-500 mt-1">
              {{ errors?.acceptTerms }}
            </p>
          </div>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          full-width
        >
          {{ isSubmitting ? "Creating Account..." : "Create Account" }}
        </BaseButton>
      </div>
    </Form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">
          Sign in
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

const backendError = ref<string | null>(null);

// Validation schema
const registerSchema = toTypedSchema(
  z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        ),
      email: z.string().email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
      confirmPassword: z.string(),
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms of service",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })
);

// Auth store
const authStore = useAuthStore();

// Handle registration
const handleRegister = async (values: any) => {
  try {
    // Clear any previous errors
    backendError.value = null;

    console.log("Submitting registration with values:", {
      ...values,
      password: values.password ? "***" : undefined,
      confirmPassword: values.confirmPassword ? "***" : undefined,
    });

    await authStore.register({
      username: values.username,
      email: values.email,
      password: values.password,
      acceptTerms: values.acceptTerms,
    });

    // Redirect to explore page after successful registration
    console.log("Registration successful, redirecting to explore page");
    await navigateTo("/explore");
  } catch (error: any) {
    console.error("Registration failed:", error);
    // Get a meaningful error message
    backendError.value =
      error.data?.message ||
      authStore.error ||
      "Registration failed. Please try again later.";
  }
};
</script>

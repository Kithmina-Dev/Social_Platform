<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          Reset your password
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <VeeForm
        :validation-schema="resetSchema"
        @submit="handleReset"
        class="mt-8 space-y-6"
      >
        <div class="rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <VeeField
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
            <VeeErrorMessage name="email" class="text-red-500 text-xs mt-1" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send reset link
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Return to login
          </NuxtLink>
        </div>
      </VeeForm>

      <!-- Success message (hidden by default) -->
      <div
        v-if="resetEmailSent"
        class="mt-4 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md"
      >
        <p>
          We've sent a password reset link to your email. Please check your
          inbox.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref } from "vue";

definePageMeta({
  middleware: ["guest"],
});

const resetSchema = toTypedSchema(
  z.object({
    email: z.string().email("Please enter a valid email address"),
  })
);

const resetEmailSent = ref(false);

const handleReset = async (values: any) => {
  // Handle password reset logic here
  console.log("Password reset requested for:", values.email);

  // Simulate API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Show success message
  resetEmailSent.value = true;
};
</script>

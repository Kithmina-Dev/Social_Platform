<template>
  <div class="form-container p-4">
    <h2 class="text-xl font-bold mb-4">VeeValidate Form Example</h2>

    <VeeForm :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium mb-1">Email</label>
        <VeeField
          name="email"
          type="email"
          id="email"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.email }"
        />
        <VeeErrorMessage name="email" class="text-sm text-red-500" />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium mb-1"
          >Password</label
        >
        <VeeField
          name="password"
          type="password"
          id="password"
          class="w-full px-3 py-2 border rounded-md"
          :class="{ 'border-red-500': errors.password }"
        />
        <VeeErrorMessage name="password" class="text-sm text-red-500" />
      </div>

      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Submitting..." : "Submit" }}
      </button>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

// Define your schema using Zod
const validationSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Convert Zod schema to VeeValidate schema
const schema = toTypedSchema(validationSchema);

// Form submit handler
function onSubmit(values) {
  // Process form submission here
  console.log("Form submitted with values:", values);
}
</script>

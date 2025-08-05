<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="mimport { ref } from 'vue';
// @ts-ignore
import { useRouter } from '#imports';
import * as z from 'zod';
// @ts-ignore
import { useZodForm } from '~/composables/useZodForm';

const router = useRouter();d w-full space-y-8">
      <div>
        <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            sign in to existing account
          </NuxtLink>
        </p>
      </div>
      
      <div v-if="authError" class="bg-red-50 border-l-4 border-red-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ authError }}</p>
          </div>
        </div>
      </div>
      
      <form class="mt-8 space-y-6" @submit="onSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input 
              id="username" 
              v-model="username.value" 
              name="username" 
              type="text" 
              autocomplete="username"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Username"
            />
            <p v-if="username.hasError" class="mt-1 text-sm text-red-600">{{ username.errorMessage }}</p>
          </div>
          
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input 
              id="email" 
              v-model="email.value" 
              name="email" 
              type="email" 
              autocomplete="email" 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Email address"
            />
            <p v-if="email.hasError" class="mt-1 text-sm text-red-600">{{ email.errorMessage }}</p>
          </div>
          
          <div>
            <label for="password" class="sr-only">Password</label>
            <input 
              id="password" 
              v-model="password.value" 
              name="password" 
              type="password" 
              autocomplete="new-password" 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Password"
            />
            <p v-if="password.hasError" class="mt-1 text-sm text-red-600">{{ password.errorMessage }}</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <input 
              id="confirmPassword" 
              v-model="confirmPassword.value" 
              name="confirmPassword" 
              type="password" 
              autocomplete="new-password" 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Confirm password"
            />
            <p v-if="confirmPassword.hasError" class="mt-1 text-sm text-red-600">{{ confirmPassword.errorMessage }}</p>
          </div>
        </div>

        <div class="flex items-center">
          <input 
            id="terms" 
            v-model="termsAccepted.value" 
            name="terms" 
            type="checkbox" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </label>
        </div>
        <p v-if="termsAccepted.hasError" class="mt-1 text-sm text-red-600">{{ termsAccepted.errorMessage }}</p>

        <div>
          <button 
            type="submit" 
            :disabled="isSubmitting" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ isSubmitting ? 'Creating account...' : 'Register' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as z from 'zod';
import { useZodForm } from '../composables/useZodForm';

const router = useRouter();
const authError = ref('');

// Define validation schema with Zod
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    message: 'You must accept the Terms of Service and Privacy Policy'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Use our custom Zod form composable
const { handleSubmit, createField, isSubmitting } = useZodForm(registerSchema);

// Create form fields
const username = createField('username');
const email = createField('email');
const password = createField('password');
const confirmPassword = createField('confirmPassword');
const termsAccepted = createField('termsAccepted');

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
  try {
    authError.value = '';
    
    // Call your registration API here
    // const response = await register(values.username, values.email, values.password);
    
    console.log('Registration submitted:', values);
    
    // For now, just simulate a successful registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to login page with success message
    router.push('/login?registered=true');
  } catch (error: any) {
    authError.value = error.message || 'Registration failed. Please try again.';
  }
});
</script>

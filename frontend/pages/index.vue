<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-6 text-center"
  >
    <div class="max-w-3xl mx-auto">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Welcome to Social Platform
      </h1>
      <p class="text-xl text-gray-600 mb-12">
        Connect with friends, share moments, and discover new communities.
      </p>

      <div class="flex flex-wrap gap-4 justify-center">
        <button
          class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          @click="navigateToLogin"
        >
          Sign In
        </button>
        <button
          class="px-8 py-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-200 transition font-medium"
          @click="navigateToRegister"
        >
          Create Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// Set the layout for the landing page
definePageMeta({
  layout: "landing",
});

// Get auth store
const authStore = useAuthStore();

// Redirect if user is already authenticated
if (process.client && authStore.isAuthenticated) {
  navigateTo("/explore");
}

// Navigation functions
const navigateToLogin = () => {
  navigateTo("/login");
};

const navigateToRegister = () => {
  navigateTo("/register");
};
</script>

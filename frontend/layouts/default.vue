<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Error Banner for Auth Errors -->
    <div
      v-if="authStore.error && authStore.isAuthenticated"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 mx-4 mt-4 rounded shadow"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            {{ authStore.error }}
            <button
              @click="authStore.fetchUserProfile()"
              class="font-medium underline text-yellow-700 hover:text-yellow-600 ml-2"
            >
              Retry
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Header -->
    <LayoutAppHeader v-if="authStore.isAuthenticated" />

    <header v-else class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              Social Platform
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </NuxtLink>

            <div class="flex items-center space-x-4">
              <NuxtLink
                to="/login"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign Up
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <LayoutAppSideBar v-if="authStore.isAuthenticated" />

      <!-- Main Content -->
      <main
        :class="{ 'flex-grow': true, 'w-full': !authStore.isAuthenticated }"
      >
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-center items-center p-10">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          ></div>
        </div>

        <!-- Content -->
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { navigateTo } from "nuxt/app";

const authStore = useAuthStore();
const isLoading = ref(false);

const handleLogout = async () => {
  authStore.logout();
  await navigateTo("/login");
};

// Check if token exists but user data is missing
onMounted(() => {
  if (process.client) {
    if (authStore.token && !authStore.currentUser) {
      isLoading.value = true;
      // Attempt to refresh user data
      authStore.fetchUserProfile().finally(() => {
        isLoading.value = false;
      });
    }
  }
});

// Redirect to explore page if authenticated and trying to access home page
if (
  process.client &&
  authStore.isAuthenticated &&
  window.location.pathname === "/"
) {
  navigateTo("/explore");
}
</script>

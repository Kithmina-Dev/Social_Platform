<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
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
            
            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                Welcome, {{ authStore.currentUser?.username }}
              </span>
              <button
                @click="handleLogout"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
            
            <div v-else class="flex items-center space-x-4">
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

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from 'nuxt/app'

const authStore = useAuthStore()

const handleLogout = async () => {
  authStore.logout()
  await navigateTo('/login')
}
</script>

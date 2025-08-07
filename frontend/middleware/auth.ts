import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuthStore } from "../stores/auth"

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Initialize auth on client side
  if (process.client) {
    authStore.initializeAuth()
  }
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})

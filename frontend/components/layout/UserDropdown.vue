<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Avatar
        :image="currentUser?.avatar || ''"
        :label="currentUser?.username?.charAt(0)?.toUpperCase() || 'U'"
        class="w-8 h-8"
      />
      <span class="hidden md:block text-sm font-medium text-gray-700">
        {{ currentUser?.username || 'User' }}
      </span>
      <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
    >
      <NuxtLink
        :to="`/profile/${currentUser?.username}`"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="isOpen = false"
      >
        Profile
      </NuxtLink>
      
      <NuxtLink
        to="/settings"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="isOpen = false"
      >
        Settings
      </NuxtLink>
      
      <hr class="my-1" />
      
      <button
        @click="handleLogout"
        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const isOpen = ref(false)

const currentUser = computed(() => authStore.currentUser)

const handleLogout = () => {
  authStore.logout()
  isOpen.value = false
  navigateTo('/login')
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  })
})
</script>

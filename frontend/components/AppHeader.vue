<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex px-2 lg:px-0">
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/">
              <img class="h-8 w-auto" src="/logo.svg" alt="Social Platform" />
            </NuxtLink>
          </div>
          
          <nav class="hidden lg:ml-10 lg:flex lg:items-center lg:space-x-4">
            <NuxtLink 
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
              :class="isActive('/') ? 'text-blue-600' : 'text-gray-700'"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/posts/search"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
              :class="isActive('/posts/search') ? 'text-blue-600' : 'text-gray-700'"
            >
              Explore
            </NuxtLink>
            <NuxtLink 
              v-if="isAuthenticated"
              to="/posts/create"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
              :class="isActive('/posts/create') ? 'text-blue-600' : 'text-gray-700'"
            >
              Create Post
            </NuxtLink>
          </nav>
        </div>
        
        <div class="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
          <div class="max-w-lg w-full lg:max-w-xs">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                id="search" 
                name="search" 
                v-model="searchQuery"
                @keyup.enter="performSearch"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Search posts..." 
                type="search" 
              />
            </div>
          </div>
        </div>
        
        <div class="flex items-center lg:hidden">
          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
              :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              class="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
              :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="hidden lg:ml-4 lg:flex lg:items-center">
          <div v-if="isAuthenticated" class="flex items-center space-x-4">
            <!-- Notifications dropdown -->
            <div class="relative">
              <button 
                @click="toggleNotifications"
                data-notification-button
                class="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">View notifications</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <!-- Notification badge -->
                <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              </button>
              
              <!-- Notification dropdown -->
              <div 
                v-if="notificationsOpen" 
                data-notification-dropdown
                class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div class="py-1">
                  <div class="px-4 py-2 border-b border-gray-200">
                    <h3 class="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
                    No new notifications
                  </div>
                  <div v-else>
                    <a 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      href="#"
                      class="block px-4 py-2 hover:bg-gray-100 transition ease-in-out duration-150"
                    >
                      <div class="flex items-start">
                        <div class="flex-shrink-0">
                          <img 
                            v-if="notification.avatar" 
                            class="h-8 w-8 rounded-full" 
                            :src="notification.avatar" 
                            alt="" 
                          />
                          <div v-else class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                            {{ notification.from?.charAt(0).toUpperCase() }}
                          </div>
                        </div>
                        <div class="ml-3 w-0 flex-1">
                          <p class="text-sm font-medium text-gray-900">
                            {{ notification.from }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ notification.message }}
                          </p>
                          <p class="mt-1 text-xs text-gray-400">
                            {{ formatDate(notification.createdAt) }}
                          </p>
                        </div>
                      </div>
                    </a>
                    <div class="px-4 py-2 text-center border-t border-gray-200">
                      <a href="#" class="text-xs font-medium text-blue-600 hover:text-blue-500">
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Profile dropdown -->
            <div class="relative">
              <button 
                @click="toggleProfileMenu"
                data-profile-button
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Open user menu</span>
                <div v-if="user?.avatar" class="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                  <img :src="user.avatar" alt="User avatar" class="h-full w-full object-cover" />
                </div>
                <div v-else class="h-8 w-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                  {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
              </button>
              
              <!-- Profile dropdown menu -->
              <div 
                v-if="profileMenuOpen" 
                data-profile-dropdown
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div class="py-1">
                  <NuxtLink 
                    :to="'/profile/' + (user?.username || '')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="profileMenuOpen = false"
                  >
                    Your Profile
                  </NuxtLink>
                  <NuxtLink 
                    to="/profile/edit"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="profileMenuOpen = false"
                  >
                    Settings
                  </NuxtLink>
                  <button 
                    @click="logout"
                    class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center space-x-2">
            <NuxtLink 
              to="/login"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log in
            </NuxtLink>
            <NuxtLink 
              to="/register"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <NuxtLink 
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
          :class="isActive('/') ? 'text-blue-600' : 'text-gray-700'"
          @click="mobileMenuOpen = false"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/posts/search"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
          :class="isActive('/posts/search') ? 'text-blue-600' : 'text-gray-700'"
          @click="mobileMenuOpen = false"
        >
          Explore
        </NuxtLink>
        <NuxtLink 
          v-if="isAuthenticated"
          to="/posts/create"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
          :class="isActive('/posts/create') ? 'text-blue-600' : 'text-gray-700'"
          @click="mobileMenuOpen = false"
        >
          Create Post
        </NuxtLink>
      </div>
      
      <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div v-if="user?.avatar" class="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
              <img :src="user.avatar" alt="User avatar" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
              {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user?.username }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <NuxtLink 
            :to="'/profile/' + (user?.username || '')"
            class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="mobileMenuOpen = false"
          >
            Your Profile
          </NuxtLink>
          <NuxtLink 
            to="/profile/edit"
            class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="mobileMenuOpen = false"
          >
            Settings
          </NuxtLink>
          <button 
            @click="logout"
            class="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>
      
      <div v-else class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center justify-center space-x-2 px-4">
          <NuxtLink 
            to="/login"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="mobileMenuOpen = false"
          >
            Log in
          </NuxtLink>
          <NuxtLink 
            to="/register"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="mobileMenuOpen = false"
          >
            Sign up
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// State
const mobileMenuOpen = ref(false);
const notificationsOpen = ref(false);
const profileMenuOpen = ref(false);
const searchQuery = ref('');

// Mock notifications data
const notifications = ref([
  { 
    id: 1, 
    from: 'Jane Smith', 
    message: 'liked your post', 
    avatar: null, 
    createdAt: new Date(Date.now() - 30 * 60000).toISOString() 
  },
  { 
    id: 2, 
    from: 'John Doe', 
    message: 'commented on your post', 
    avatar: null, 
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString() 
  }
]);

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.getUser);
const notificationCount = computed(() => notifications.value.length);

// Methods
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  // Close other menus
  notificationsOpen.value = false;
  profileMenuOpen.value = false;
}

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value;
  // Close other menus
  profileMenuOpen.value = false;
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value;
  // Close other menus
  notificationsOpen.value = false;
}

function isActive(path: string) {
  return route.path.startsWith(path);
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'min' : 'mins'} ago`;
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function performSearch() {
  if (!searchQuery.value.trim()) return;
  
  router.push({
    path: '/posts/search',
    query: { q: searchQuery.value }
  });
  
  // Close mobile menu
  mobileMenuOpen.value = false;
}

async function logout() {
  try {
    await authStore.logout();
    profileMenuOpen.value = false;
    mobileMenuOpen.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Failed to logout:', error);
  }
}

// Close menus when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (!event.target || !(event.target instanceof Element)) return;
    
    // Check if the click target is part of the notification button or dropdown
    const notificationButton = document.querySelector('[data-notification-button]');
    const notificationDropdown = document.querySelector('[data-notification-dropdown]');
    const isNotificationClick = notificationButton?.contains(event.target) || notificationDropdown?.contains(event.target);
    
    // Check if the click target is part of the profile button or dropdown
    const profileButton = document.querySelector('[data-profile-button]');
    const profileDropdown = document.querySelector('[data-profile-dropdown]');
    const isProfileClick = profileButton?.contains(event.target) || profileDropdown?.contains(event.target);
    
    // Close dropdowns if clicked outside
    if (notificationsOpen.value && !isNotificationClick) {
      notificationsOpen.value = false;
    }
    
    if (profileMenuOpen.value && !isProfileClick) {
      profileMenuOpen.value = false;
    }
  });
});
</script>

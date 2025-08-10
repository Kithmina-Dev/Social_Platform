<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <div class="p-6">
      <!-- Navigation Menu -->
      <nav class="space-y-2">
        <NuxtLink
          to="/explore"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{
            'bg-blue-50 text-blue-700':
              $route.path === '/' || $route.path === '/explore',
          }"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="font-medium">Home</span>
        </NuxtLink>

        <NuxtLink
          to="/explore"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-blue-50 text-blue-700': $route.path === '/explore' }"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span class="font-medium">Explore</span>
        </NuxtLink>

        <NuxtLink
          to="/messages"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{
            'bg-blue-50 text-blue-700': $route.path.startsWith('/messages'),
          }"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span class="font-medium">Messages</span>
        </NuxtLink>

        <NuxtLink
          :to="`/profile/${currentUser?.username}`"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{
            'bg-blue-50 text-blue-700': $route.path.startsWith('/profile'),
          }"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span class="font-medium">Profile</span>
        </NuxtLink>
      </nav>

      <!-- Create Post Button -->
      <div class="mt-8">
        <button
          @click="showCreatePost = true"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create Post</span>
        </button>
      </div>
    </div>

    <!-- Create Post Modal -->
    <Dialog
      v-model:visible="showCreatePost"
      modal
      header="Create New Post"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <PostForm @post-created="handlePostCreated" />
    </Dialog>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import Dialog from "primevue/dialog";
import PostForm from "~/components/posts/PostForm.vue";

const authStore = useAuthStore();
const showCreatePost = ref(false);

const currentUser = computed(() => authStore.currentUser);

const handlePostCreated = () => {
  showCreatePost.value = false;
  // Refresh posts or navigate to the new post
};
</script>

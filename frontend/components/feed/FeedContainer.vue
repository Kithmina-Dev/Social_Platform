<template>
  <div class="space-y-6">
    <!-- Create Post Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-start space-x-4">
        <Avatar
          :image="currentUser?.avatar || ''"
          :label="currentUser?.username?.charAt(0)?.toUpperCase() || 'U'"
          class="w-10 h-10"
        />
        <div class="flex-1">
          <button
            @click="showCreatePost = true"
            class="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span class="text-gray-500">What's on your mind?</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Posts Feed -->
    <div class="space-y-4">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @post-updated="refreshPosts"
        @post-deleted="refreshPosts"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="hasMorePosts" class="text-center">
      <button
        @click="loadMorePosts"
        :disabled="isLoading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Load More</span>
      </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PostCard from '../posts/PostCard.vue'
import PostForm from '../posts/PostForm.vue'
const config = useRuntimeConfig()

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface PostResponse {
  data: Post[];
}

const authStore = useAuthStore()
const posts = ref<Post[]>([])
const isLoading = ref(false)
const hasMorePosts = ref(true)
const showCreatePost = ref(false)
const page = ref(1)

const currentUser = computed(() => authStore.currentUser)

// Fetch posts from API
const fetchPosts = async () => {
  try {
    isLoading.value = true
    const response = await $fetch<PostResponse>('/posts', {
      baseURL: config.public.apiBaseUrl,
      params: { page: page.value }
    })
    
    if (page.value === 1) {
      posts.value = response.data || []
    } else {
      posts.value.push(...(response.data || []))
    }
    
    hasMorePosts.value = response.data?.length === 10
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMorePosts = async () => {
  page.value++
  await fetchPosts()
}

const refreshPosts = async () => {
  page.value = 1
  await fetchPosts()
}

const handlePostCreated = () => {
  showCreatePost.value = false
  refreshPosts()
}

onMounted(() => {
  fetchPosts()
})
</script>

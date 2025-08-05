<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left sidebar -->
      <div class="hidden lg:block lg:col-span-1">
        <div class="sticky top-20">
          <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div class="px-4 py-5">
              <h2 class="text-lg font-medium text-gray-900">Categories</h2>
              <nav class="mt-4 space-y-2">
                <a 
                  v-for="(category, index) in categories" 
                  :key="index"
                  href="#"
                  @click.prevent="filterByCategory(category)"
                  class="flex items-center text-sm text-gray-600 hover:text-blue-600 py-2"
                  :class="selectedCategory === category ? 'text-blue-600 font-medium' : ''"
                >
                  <span class="truncate">{{ category }}</span>
                  <span class="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {{ categoryCounts[category] || 0 }}
                  </span>
                </a>
              </nav>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div class="px-4 py-5">
              <h2 class="text-lg font-medium text-gray-900">Popular Tags</h2>
              <div class="mt-4 flex flex-wrap gap-2">
                <a 
                  v-for="(tag, index) in popularTags" 
                  :key="index"
                  href="#"
                  @click.prevent="filterByTag(tag)"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  #{{ tag }}
                </a>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5">
              <h2 class="text-lg font-medium text-gray-900">Who to Follow</h2>
              <ul class="mt-4 space-y-4">
                <li v-for="(user, index) in suggestedUsers" :key="index" class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                      <img 
                        v-if="user.avatar" 
                        :src="user.avatar" 
                        alt="User avatar" 
                        class="h-full w-full object-cover"
                      />
                      <div v-else class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      <NuxtLink :to="`/profile/${user.username}`" class="hover:underline">
                        {{ user.username }}
                      </NuxtLink>
                    </p>
                  </div>
                  <div class="flex-shrink-0">
                    <button 
                      @click="followUser(user)"
                      class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Follow
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main content -->
      <div class="lg:col-span-2">
        <!-- Filter toolbar -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div class="flex items-center justify-between flex-wrap sm:flex-nowrap">
              <h2 class="text-lg font-medium text-gray-900">
                {{ selectedCategory || 'Latest Posts' }}
              </h2>
              <div class="flex">
                <select 
                  v-model="sortBy" 
                  class="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="commented">Most Commented</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
              <button 
                @click="fetchPosts()"
                class="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="posts.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ selectedCategory ? `There are no posts in ${selectedCategory}` : 'There are no posts yet' }}
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/posts/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create a post
            </NuxtLink>
          </div>
        </div>
        
        <!-- Posts list -->
        <div v-else class="space-y-6">
          <PostCard 
            v-for="post in posts" 
            :key="post.id" 
            :post="post"
          />
          
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
                  of
                  <span class="font-medium">{{ totalItems }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <template v-for="page in paginationArray" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="changePage(page)"
                      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                      :class="currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-50'"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                      ...
                    </span>
                  </template>
                  
                  <button
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
                  >
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
            
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
              >
                Previous
              </button>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right sidebar -->
      <div class="hidden lg:block lg:col-span-1">
        <div class="sticky top-20">
          <!-- If user is authenticated, show create post button -->
          <div v-if="isAuthenticated" class="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div class="p-4">
              <NuxtLink
                to="/posts/create"
                class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Post
              </NuxtLink>
            </div>
          </div>
          
          <!-- Trending posts -->
          <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div class="px-4 py-5 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Trending</h2>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="(post, index) in trendingPosts"
                :key="post.id"
                class="p-4 hover:bg-gray-50 cursor-pointer"
                @click="navigateToPost(post.id)"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0 text-gray-400 mr-3">
                    <span class="font-bold">#{{ index + 1 }}</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ post.title }}</h3>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ post.likes }} likes • {{ post.comments }} comments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Advertisements -->
          <div class="bg-gray-100 rounded-lg overflow-hidden text-center p-4">
            <p class="text-xs text-gray-500 mb-2">Advertisement</p>
            <div class="bg-gray-300 rounded-md h-48 flex items-center justify-center">
              <p class="text-gray-600 font-medium">Ad Space Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { usePostsStore } from '~/stores/posts';

// Router and route
const router = useRouter();
const route = useRoute();

// Stores
const authStore = useAuthStore();
const postsStore = usePostsStore();

// Component state
const loading = ref(false);
const error = ref('');
const posts = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const selectedCategory = ref('');
const sortBy = ref('latest');

// Mock data
const categories = [
  'All Posts',
  'Technology',
  'Science',
  'Health',
  'Entertainment',
  'Sports',
  'Business',
  'Lifestyle',
  'Travel',
  'Food'
];

const categoryCounts = {
  'All Posts': 87,
  'Technology': 23,
  'Science': 14,
  'Health': 11,
  'Entertainment': 9,
  'Sports': 7,
  'Business': 8,
  'Lifestyle': 6,
  'Travel': 5,
  'Food': 4
};

const popularTags = [
  'javascript',
  'webdev',
  'programming',
  'design',
  'ux',
  'react',
  'vue',
  'technology',
  'innovation'
];

const suggestedUsers = [
  { username: 'techguru', avatar: null },
  { username: 'designmaster', avatar: null },
  { username: 'codewhisperer', avatar: null }
];

const trendingPosts = [
  { id: '1', title: 'The Future of Web Development in 2023', likes: 342, comments: 56 },
  { id: '2', title: 'How to Optimize Your React Applications', likes: 257, comments: 42 },
  { id: '3', title: '10 Must-know JavaScript Tips for Beginners', likes: 189, comments: 37 },
  { id: '4', title: 'Building Responsive UIs with Tailwind CSS', likes: 124, comments: 28 },
  { id: '5', title: 'Getting Started with TypeScript: A Beginner\'s Guide', likes: 98, comments: 19 }
];

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);

const paginationArray = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  const current = currentPage.value;
  const last = totalPages.value;
  
  if (current <= 3) {
    return [1, 2, 3, 4, '...', last - 1, last];
  }
  
  if (current >= last - 2) {
    return [1, 2, '...', last - 3, last - 2, last - 1, last];
  }
  
  return [1, '...', current - 1, current, current + 1, '...', last];
});

// Methods
async function fetchPosts() {
  loading.value = true;
  error.value = '';
  
  try {
    // In a real app, you would fetch posts from your API using the postsStore
    // const response = await postsStore.fetchPosts(currentPage.value, pageSize.value);
    // posts.value = response;
    
    // For now, let's simulate API response with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock posts
    posts.value = Array.from({ length: 10 }, (_, i) => ({
      id: `post-${currentPage.value}-${i}`,
      title: `Post ${i + 1} on page ${currentPage.value}`,
      content: 'This is a sample post content that would appear on the homepage. It contains enough text to demonstrate how the card layout works.',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      image: i % 3 === 0 ? `https://picsum.photos/id/${i + 10}/400/300` : null,
      author: {
        id: `user-${i}`,
        username: `user${i}`,
        avatar: null
      },
      tags: ['webdev', 'programming', i % 2 === 0 ? 'design' : 'technology']
    }));
    
    // Set pagination data
    totalItems.value = 87; // Total number of posts
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load posts. Please try again.';
    console.error('Error fetching posts:', err);
  } finally {
    loading.value = false;
  }
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  
  currentPage.value = page;
  router.push({
    query: { 
      ...route.query,
      page 
    }
  });
}

function filterByCategory(category: string) {
  selectedCategory.value = category === 'All Posts' ? '' : category;
  currentPage.value = 1;
  fetchPosts();
}

function filterByTag(tag: string) {
  router.push({
    path: '/posts/search',
    query: { tag }
  });
}

function navigateToPost(postId: string) {
  router.push(`/posts/${postId}`);
}

function followUser(user: any) {
  // This would usually call an API to follow the user
  console.log(`Following user: ${user.username}`);
  
  // Remove from suggested users
  suggestedUsers.splice(suggestedUsers.indexOf(user), 1);
}

// Watch for query parameter changes
watch(() => route.query, (newQuery) => {
  if (newQuery.page) {
    const page = parseInt(newQuery.page as string, 10);
    if (page && page !== currentPage.value) {
      currentPage.value = page;
      fetchPosts();
    }
  }
}, { immediate: true });

// Watch for sort changes
watch(sortBy, () => {
  fetchPosts();
});

// Fetch posts on component mount
onMounted(() => {
  if (!route.query.page) {
    fetchPosts();
  }
});
</script>

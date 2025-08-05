<template>
  <div class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-8">
        <!-- Profile header -->
        <div class="flex flex-col md:flex-row md:items-center md:space-x-6">
          <!-- Avatar -->
          <div class="flex-shrink-0 mb-4 md:mb-0">
            <div class="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100">
              <img 
                v-if="user.avatar" 
                :src="user.avatar" 
                alt="User avatar" 
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-4xl font-bold">
                {{ user.username?.charAt(0).toUpperCase() }}
              </div>
              
              <button 
                v-if="isCurrentUser" 
                class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
                @click="uploadAvatar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleAvatarChange" 
              />
            </div>
          </div>
          
          <!-- User info -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">{{ user.username }}</h1>
            <p class="text-gray-600">{{ user.email }}</p>
            
            <div class="mt-4 flex space-x-3">
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ stats.posts }} Posts
              </span>
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {{ stats.followers }} Followers
              </span>
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {{ stats.following }} Following
              </span>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="mt-6 md:mt-0 flex space-x-3">
            <button 
              v-if="isCurrentUser" 
              @click="router.push('/profile/edit')" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
            
            <button 
              v-else 
              @click="toggleFollow" 
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="isFollowing" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 11h6m-3-3v6" />
              </svg>
              {{ isFollowing ? 'Unfollow' : 'Follow' }}
            </button>
          </div>
        </div>
        
        <!-- Bio section -->
        <div v-if="user.bio" class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-800">{{ user.bio }}</p>
        </div>
        
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="activeTab = 'posts'" 
              class="px-1 pb-4 text-sm font-medium transition-colors duration-200"
              :class="activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Posts
            </button>
            <button 
              @click="activeTab = 'media'" 
              class="px-1 pb-4 text-sm font-medium transition-colors duration-200"
              :class="activeTab === 'media' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Media
            </button>
            <button 
              @click="activeTab = 'liked'" 
              class="px-1 pb-4 text-sm font-medium transition-colors duration-200"
              :class="activeTab === 'liked' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Liked
            </button>
          </nav>
        </div>
        
        <!-- Content based on active tab -->
        <div v-if="activeTab === 'posts'" class="space-y-6">
          <div v-if="userPosts.length === 0" class="text-center py-12">
            <p class="text-gray-500">No posts yet.</p>
          </div>
          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PostCard 
              v-for="post in userPosts" 
              :key="post.id" 
              :post="post"
            />
          </div>
        </div>
        
        <div v-else-if="activeTab === 'media'" class="space-y-6">
          <div v-if="mediaFiles.length === 0" class="text-center py-12">
            <p class="text-gray-500">No media yet.</p>
          </div>
          <div v-else class="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div 
              v-for="media in mediaFiles" 
              :key="media.id"
              class="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img :src="media.url" :alt="media.description || 'Media'" class="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        
        <div v-else-if="activeTab === 'liked'" class="space-y-6">
          <div v-if="likedPosts.length === 0" class="text-center py-12">
            <p class="text-gray-500">No liked posts yet.</p>
          </div>
          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PostCard 
              v-for="post in likedPosts" 
              :key="post.id" 
              :post="post"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useAuthStore } from '~/stores/auth';

// Component props
const props = defineProps({
  username: {
    type: String,
    required: false
  }
});

// Router and route
const router = useRouter();
const route = useRoute();

// Auth store for current user info
const authStore = useAuthStore();

// Component state
const loading = ref(true);
const error = ref('');
const user = ref<any>({});
const stats = ref({
  posts: 0,
  followers: 0,
  following: 0
});
const activeTab = ref('posts');
const userPosts = ref<any[]>([]);
const mediaFiles = ref<any[]>([]);
const likedPosts = ref<any[]>([]);
const isFollowing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Computed properties
const isCurrentUser = computed(() => {
  return authStore.user && user.value && authStore.user.id === user.value.id;
});

// Get the username from props or route params
const username = computed(() => {
  return props.username || route.params.username;
});

// Fetch user profile data
async function fetchUserProfile() {
  try {
    loading.value = true;
    error.value = '';
    
    // In a real app, you would fetch the user profile from your API
    // const response = await fetch(`/api/users/${username.value}`);
    // user.value = await response.json();
    
    // For now, let's simulate API response with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    user.value = {
      id: username.value === authStore.user?.username ? authStore.user?.id : 'user-123',
      username: username.value || 'johndoe',
      email: 'john@example.com',
      bio: 'Software developer and tech enthusiast. Lover of good coffee and great code.',
      avatar: null
    };
    
    // Mock stats
    stats.value = {
      posts: 42,
      followers: 156,
      following: 98
    };
    
    // Check if current user is following this profile
    isFollowing.value = Math.random() > 0.5; // Random for demo purposes
    
    // Also fetch user posts
    await fetchUserPosts();
    
    loading.value = false;
  } catch (err: any) {
    loading.value = false;
    error.value = err.message || 'Failed to load user profile';
    console.error('Error fetching user profile:', err);
  }
}

// Fetch user posts
async function fetchUserPosts() {
  try {
    // In a real app, you would fetch posts from your API
    // const response = await fetch(`/api/users/${username.value}/posts`);
    // userPosts.value = await response.json();
    
    // For now, let's simulate API response with mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock posts data
    userPosts.value = Array.from({ length: 6 }, (_, i) => ({
      id: `post-${i}`,
      title: `Post ${i + 1}`,
      content: 'This is a sample post content that would appear in the user profile.',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      image: i % 2 === 0 ? `https://picsum.photos/id/${i + 10}/400/300` : null
    }));
    
    // Mock media files
    mediaFiles.value = Array.from({ length: 9 }, (_, i) => ({
      id: `media-${i}`,
      url: `https://picsum.photos/id/${i + 20}/400/400`,
      description: `Image ${i + 1}`
    }));
    
    // Mock liked posts
    likedPosts.value = Array.from({ length: 3 }, (_, i) => ({
      id: `liked-${i}`,
      title: `Liked Post ${i + 1}`,
      content: 'This is a post that the user has liked.',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      image: i % 2 === 0 ? `https://picsum.photos/id/${i + 30}/400/300` : null
    }));
    
  } catch (err: any) {
    console.error('Error fetching user posts:', err);
  }
}

// Toggle follow status
function toggleFollow() {
  // In a real app, you would make an API request to follow/unfollow
  // await fetch(`/api/users/${username.value}/follow`, { method: 'POST' });
  
  isFollowing.value = !isFollowing.value;
  
  // Update followers count
  if (isFollowing.value) {
    stats.value.followers++;
  } else {
    stats.value.followers--;
  }
}

// Trigger file input click for avatar upload
function uploadAvatar() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Handle avatar file change
function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should not exceed 2MB');
      return;
    }
    
    // In a real app, you would upload the file to your server
    // For now, just create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.avatar = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Load user profile on component mount
onMounted(() => {
  fetchUserProfile();
});
</script>

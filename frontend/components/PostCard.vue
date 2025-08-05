<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Post header with author info -->
    <div class="p-4 flex items-center space-x-3">
      <div 
        v-if="post.author" 
        class="flex-shrink-0"
        @click.stop="navigateToProfile(post.author.username)"
      >
        <div class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer">
          <img 
            v-if="post.author.avatar" 
            :src="post.author.avatar" 
            alt="Author avatar" 
            class="h-full w-full object-cover"
          />
          <div v-else class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
            {{ post.author.username?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
      
      <div class="min-w-0 flex-1">
        <p 
          v-if="post.author" 
          class="text-sm font-medium text-gray-900 cursor-pointer hover:underline"
          @click.stop="navigateToProfile(post.author.username)"
        >
          {{ post.author.username }}
        </p>
        <p class="text-xs text-gray-500">
          {{ formatDate(post.createdAt) }}
          <span v-if="post.createdAt !== post.updatedAt" class="italic"> (edited)</span>
        </p>
      </div>
      
      <div v-if="isOwner" class="flex-shrink-0 relative">
        <button 
          @click.stop="toggleMenu" 
          class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        <div 
          v-if="menuOpen" 
          class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        >
          <div class="py-1">
            <a 
              href="#" 
              @click.prevent.stop="editPost" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit Post
            </a>
            <a 
              href="#" 
              @click.prevent.stop="confirmDelete" 
              class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete Post
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Post image if exists -->
    <div v-if="post.image" class="relative aspect-video bg-gray-100">
      <img 
        :src="post.image" 
        alt="Post image" 
        class="w-full h-full object-cover cursor-pointer"
        @click.stop="navigateToPost"
      />
    </div>
    
    <!-- Post content -->
    <div class="p-4">
      <h3 
        class="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
        @click.stop="navigateToPost"
      >
        {{ post.title }}
      </h3>
      
      <p 
        class="text-gray-700 line-clamp-3 mb-3 cursor-pointer"
        @click.stop="navigateToPost"
      >
        {{ post.content }}
      </p>
      
      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
          @click.stop="searchByTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>
      
      <!-- Post actions -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex space-x-4">
          <button 
            @click.stop="toggleLike" 
            class="flex items-center space-x-1 focus:outline-none"
            :class="{ 'text-red-500': post.liked }"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5" 
              :class="{ 'fill-current': post.liked, 'stroke-current': !post.liked }"
              viewBox="0 0 20 20" 
              :fill="post.liked ? 'currentColor' : 'none'"
              :stroke="post.liked ? 'none' : 'currentColor'"
              stroke-width="1.5"
            >
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <span>{{ formatCount(post.likes || 0) }}</span>
          </button>
          
          <button 
            @click.stop="navigateToPost(true)" 
            class="flex items-center space-x-1 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{{ formatCount(post.comments || 0) }}</span>
          </button>
          
          <button 
            @click.stop="sharePost" 
            class="flex items-center space-x-1 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>
        
        <button 
          @click.stop="savePost" 
          class="flex items-center space-x-1 focus:outline-none"
          :class="{ 'text-blue-500': post.saved }"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="{ 'fill-current': post.saved, 'stroke-current': !post.saved }"
            viewBox="0 0 20 20" 
            :fill="post.saved ? 'currentColor' : 'none'"
            :stroke="post.saved ? 'none' : 'currentColor'"
            stroke-width="1.5"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { usePostsStore } from '../stores/posts';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const authStore = useAuthStore();
const postsStore = usePostsStore();

// State
const menuOpen = ref(false);

// Computed properties
const isOwner = computed(() => {
  // Check if user exists and if post author ID matches user ID
  return authStore.getUser && props.post.author && 
    (authStore.getUser as any).id === props.post.author.id;
});

// Methods
function formatDate(dateString: string) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // Within a week
    return `${diffDays} days ago`;
  } else {
    // Older than a week
    return date.toLocaleDateString();
  }
}

function formatCount(count: number) {
  if (count === 0) return '0';
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
  return (count / 1000000).toFixed(1) + 'M';
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function navigateToPost(focusComments = false) {
  router.push({
    path: `/posts/${props.post.id}`,
    query: focusComments ? { focus: 'comments' } : {}
  });
}

function navigateToProfile(username: string) {
  if (!username) return;
  router.push(`/profile/${username}`);
}

function searchByTag(tag: string) {
  router.push({
    path: '/posts/search',
    query: { tag }
  });
}

async function toggleLike() {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  try {
    if (props.post.liked) {
      await postsStore.unlikePost(props.post.id);
    } else {
      await postsStore.likePost(props.post.id);
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
  }
}

function editPost() {
  menuOpen.value = false;
  router.push(`/posts/${props.post.id}/edit`);
}

function confirmDelete() {
  menuOpen.value = false;
  if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    deletePost();
  }
}

async function deletePost() {
  try {
    await postsStore.deletePost(props.post.id);
    // If we're on the post detail page, redirect to home
    if (router.currentRoute.value.path === `/posts/${props.post.id}`) {
      router.push('/');
    }
  } catch (error) {
    console.error('Failed to delete post:', error);
    alert('Failed to delete post. Please try again.');
  }
}

function savePost() {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  // Toggle saved state (this would usually call an API)
  props.post.saved = !props.post.saved;
}

function sharePost() {
  // Copy the post URL to clipboard
  const url = `${window.location.origin}/posts/${props.post.id}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => alert('Post link copied to clipboard!'))
      .catch(() => alert('Failed to copy link. Please try again.'));
  } else {
    // Fallback for browsers that don't support clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('Post link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link. Please try again.');
    }
    document.body.removeChild(textarea);
  }
}

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', () => {
    menuOpen.value = false;
  });
});
</script>

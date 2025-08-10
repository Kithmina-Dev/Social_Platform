<template>
  <div class="container mx-auto max-w-3xl px-4 py-6">
    <!-- Create Post Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Create a Post</h2>
      <PostForm @post-created="onPostCreated" />
    </div>

    <!-- Post Feed -->
    <div class="space-y-6">
      <template v-if="isLoading">
        <div class="flex justify-center p-6">
          <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"
          ></div>
        </div>
      </template>

      <template v-else-if="posts.length > 0">
        <div v-for="post in posts" :key="post.id" class="mb-6">
          <PostCard
            :post="post"
            @post-updated="onPostUpdated"
            @post-deleted="onPostDeleted"
          />
        </div>

        <!-- Load More Posts -->
        <div v-if="hasMorePosts" class="flex justify-center p-4">
          <BaseButton
            text="Load More"
            variant="outline"
            :loading="isLoadingMore"
            @click="loadMorePosts"
          />
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          No more posts to display
        </div>
      </template>

      <template v-else>
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
        >
          <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
          <p class="text-gray-500 mb-4">Be the first to create a post!</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components
import PostForm from "~/components/posts/PostForm.vue";
import PostCard from "~/components/posts/PostCard.vue";

definePageMeta({
  middleware: ["auth"],
});

// Store
const postsStore = usePostsStore();

// Computed properties
const posts = computed(() => postsStore.sortedPosts);
const isLoading = computed(() => postsStore.isLoading);
const isLoadingMore = computed(() => postsStore.isLoadingMore);
const hasMorePosts = computed(() => postsStore.hasMorePosts);

// Methods
const fetchPosts = async () => {
  await postsStore.fetchPosts();
};

const loadMorePosts = async () => {
  await postsStore.loadMorePosts();
};

const onPostCreated = (post: any) => {
  // No need to do anything here, posts are already added to the store
  // We could show a success toast notification if desired
};

const onPostUpdated = (post: any) => {
  // Handle post update, could show a toast notification
};

const onPostDeleted = (postId: string) => {
  // Handle post deletion, could show a toast notification
};

// Lifecycle hooks
onMounted(async () => {
  await fetchPosts();
});
</script>

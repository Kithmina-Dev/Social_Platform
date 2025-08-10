<template>
  <div class="space-y-6">
    <template v-if="isLoading">
      <div class="flex justify-center p-6">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>
    </template>

    <template v-else-if="posts.length > 0">
      <div v-for="post in posts" :key="post.id" class="mb-6">
        <PostCard
          :post="post"
          @post-updated="$emit('post-updated', post)"
          @post-deleted="$emit('post-deleted', $event)"
        />
      </div>

      <!-- Load More Posts -->
      <div v-if="hasMorePosts" class="flex justify-center p-4">
        <Button
          label="Load More"
          class="p-button-outlined p-button-secondary"
          :loading="isLoadingMore"
          @click="$emit('load-more')"
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
</template>

<script setup lang="ts">

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

// Props
interface Props {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMorePosts: boolean;
}

const props = defineProps<Props>();

// Emits
defineEmits<{
  "post-updated": [post: Post];
  "post-deleted": [postId: string];
  "load-more": [];
}>();
</script>

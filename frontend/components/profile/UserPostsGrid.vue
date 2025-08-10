<template>
  <div>
    <div v-if="posts.length === 0" class="text-center py-12">
      <svg
        class="h-16 w-16 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-1">No posts yet</h3>
      <p v-if="isOwnProfile" class="text-gray-500">
        Your posts will appear here. Create your first post to get started.
      </p>
      <p v-else class="text-gray-500">This user hasn't posted anything yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        class="h-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  posts: any[];
  isOwnProfile: boolean;
}

const props = defineProps<Props>();
</script>

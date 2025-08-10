<template>
  <div class="flex space-x-6 mt-6">
    <div class="text-center">
      <div class="font-bold">{{ stats.postsCount }}</div>
      <div class="text-sm text-gray-500">Posts</div>
    </div>
    <div class="text-center">
      <div class="font-bold">{{ stats.followingCount }}</div>
      <div class="text-sm text-gray-500">Following</div>
    </div>
    <div class="text-center">
      <div class="font-bold">{{ stats.followersCount }}</div>
      <div class="text-sm text-gray-500">Followers</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface ProfileStats {
  postsCount: number;
  followingCount: number;
  followersCount: number;
}

interface Props {
  stats: ProfileStats;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
    
    <div class="space-y-3">
      <div
        v-for="topic in trendingTopics"
        :key="topic.id"
        class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      >
        <div>
          <div class="font-medium text-gray-900">#{{ topic.name }}</div>
          <div class="text-sm text-gray-500">{{ topic.postCount }} posts</div>
        </div>
        <div class="text-xs text-gray-400">
          {{ topic.trend }}
        </div>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-200">
      <button class="text-sm text-blue-600 hover:text-blue-500">
        Show more
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock trending topics data
const trendingTopics = ref([
  { id: 1, name: 'technology', postCount: 1234, trend: '↗️ Trending' },
  { id: 2, name: 'programming', postCount: 856, trend: '↗️ Trending' },
  { id: 3, name: 'vuejs', postCount: 432, trend: '↗️ Trending' },
  { id: 4, name: 'nuxt', postCount: 298, trend: '↗️ Trending' },
  { id: 5, name: 'typescript', postCount: 567, trend: '↗️ Trending' }
])
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Who to follow</h3>
    
    <div class="space-y-4">
      <div
        v-for="user in suggestedUsers"
        :key="user.id"
        class="flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <Avatar
            :image="user.avatar || ''"
            :label="user.username?.charAt(0)?.toUpperCase() || 'U'"
            class="w-10 h-10"
          />
          <div>
            <div class="font-medium text-gray-900">{{ user.username }}</div>
            <div class="text-sm text-gray-500">{{ user.followers }} followers</div>
          </div>
        </div>
        
        <button
          @click="followUser(user.id)"
          :disabled="user.isFollowing"
          class="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'bg-blue-600 text-white hover:bg-blue-700': user.isFollowing }"
        >
          {{ user.isFollowing ? 'Following' : 'Follow' }}
        </button>
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

// Mock suggested users data
const suggestedUsers = ref([
  { id: 1, username: 'john_doe', avatar: '', followers: 1234, isFollowing: false },
  { id: 2, username: 'jane_smith', avatar: '', followers: 856, isFollowing: false },
  { id: 3, username: 'dev_expert', avatar: '', followers: 2341, isFollowing: false },
  { id: 4, username: 'tech_guru', avatar: '', followers: 567, isFollowing: false },
  { id: 5, username: 'code_master', avatar: '', followers: 1892, isFollowing: false }
])

const followUser = (userId: number) => {
  const user = suggestedUsers.value.find(u => u.id === userId)
  if (user) {
    user.isFollowing = !user.isFollowing
  }
}
</script>

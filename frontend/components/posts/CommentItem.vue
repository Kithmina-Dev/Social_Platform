<template>
  <div class="flex items-start space-x-3">
    <Avatar
      :image="comment.author?.avatar || ''"
      :label="comment.author?.username?.charAt(0)?.toUpperCase() || 'U'"
      class="w-8 h-8"
    />
    <div class="flex-1">
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center space-x-2">
            <span class="font-semibold text-sm text-gray-900">
              {{ comment.author?.username || 'Unknown User' }}
            </span>
            <span class="text-xs text-gray-500">
              {{ formatDate(comment.createdAt) }}
            </span>
          </div>
          
          <!-- Comment Actions -->
          <div v-if="isCurrentUserComment" class="relative">
            <button
              @click="showMenu = !showMenu"
              class="p-1 hover:bg-gray-200 rounded-full"
            >
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <div
              v-if="showMenu"
              class="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <button
                @click="editComment"
                class="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                @click="deleteComment"
                class="block w-full text-left px-3 py-1 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <p class="text-sm text-gray-700">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  comment: any
}>()

const emit = defineEmits<{
  'comment-deleted': []
}>()

const authStore = useAuthStore()
const showMenu = ref(false)

const currentUser = computed(() => authStore.currentUser)

const isCurrentUserComment = computed(() => {
  return currentUser.value?.id === props.comment.authorId
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

const editComment = () => {
  // TODO: Implement edit functionality
  showMenu.value = false
}

const deleteComment = async () => {
  if (confirm('Are you sure you want to delete this comment?')) {
    try {
      const config = useRuntimeConfig()
      await $fetch(`/comments/${props.comment.id}`, {
        baseURL: config.public.apiBaseUrl,
        method: 'DELETE'
      })
      emit('comment-deleted')
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }
  showMenu.value = false
}
</script>

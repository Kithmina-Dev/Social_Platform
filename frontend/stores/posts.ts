import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from './auth'

interface Post {
  id: string
  content: string
  imageUrl?: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
  isLiked: boolean
}

interface CreatePostData {
  content: string
  image?: File
}

interface UpdatePostData {
  content: string
  image?: File
}

export const usePostsStore = defineStore('posts', () => {
  // State
  const posts = ref<Post[]>([])
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const hasMorePosts = ref(true)
  const pageSize = 10

  // Getters
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  // Actions
  const fetchPosts = async (page = 1) => {
    try {
      isLoading.value = true
      error.value = null
      
      const authStore = useAuthStore()
      const config = useRuntimeConfig()
      
      const response = await $fetch<{ posts: Post[], hasMore: boolean }>('/posts', {
        baseURL: config.public.apiBaseUrl as string,
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        params: {
          page,
          limit: pageSize
        }
      })

      if (page === 1) {
        posts.value = response.posts
      } else {
        posts.value.push(...response.posts)
      }
      
      hasMorePosts.value = response.hasMore
      currentPage.value = page
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch posts'
      console.error('Error fetching posts:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadMorePosts = async () => {
    if (isLoadingMore.value || !hasMorePosts.value) return
    
    try {
      isLoadingMore.value = true
      await fetchPosts(currentPage.value + 1)
    } finally {
      isLoadingMore.value = false
    }
  }

  const createPost = async (postData: CreatePostData) => {
    try {
      const authStore = useAuthStore()
      const config = useRuntimeConfig()
      
      const formData = new FormData()
      formData.append('content', postData.content)
      if (postData.image) {
        formData.append('image', postData.image)
      }

      const newPost = await $fetch<Post>('/posts', {
        baseURL: config.public.apiBaseUrl as string,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        body: formData
      })

      // Add the new post to the beginning of the list
      posts.value.unshift(newPost)
      
      return newPost
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to create post'
      throw err
    }
  }

  const updatePost = async (postId: string, postData: UpdatePostData) => {
    try {
      const authStore = useAuthStore()
      const config = useRuntimeConfig()
      
      const formData = new FormData()
      formData.append('content', postData.content)
      if (postData.image) {
        formData.append('image', postData.image)
      }

      const updatedPost = await $fetch<Post>(`/posts/${postId}`, {
        baseURL: config.public.apiBaseUrl as string,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        body: formData
      })

      // Update the post in the list
      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      
      return updatedPost
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to update post'
      throw err
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const authStore = useAuthStore()
      const config = useRuntimeConfig()
      
      await $fetch(`/posts/${postId}`, {
        baseURL: config.public.apiBaseUrl as string,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      // Remove the post from the list
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to delete post'
      throw err
    }
  }

  const likePost = async (postId: string) => {
    try {
      const authStore = useAuthStore()
      const config = useRuntimeConfig()
      
      await $fetch(`/posts/${postId}/like`, {
        baseURL: config.public.apiBaseUrl as string,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      // Update the post's like status
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.isLiked = !post.isLiked
        post.likes += post.isLiked ? 1 : -1
      }
    } catch (err: any) {
      console.error('Error liking post:', err)
    }
  }

  const clearPosts = () => {
    posts.value = []
    currentPage.value = 1
    hasMorePosts.value = true
    error.value = null
  }

  return {
    // State
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMorePosts,
    
    // Getters
    sortedPosts,
    
    // Actions
    fetchPosts,
    loadMorePosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    clearPosts
  }
})

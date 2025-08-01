<template>
    <div class="page-container">
        <div class="page-header">
            <h1>Social Feed</h1>
            <div class="search-bar">
                <input type="text" v-model="searchQuery" placeholder="Search posts..." />
                <button @click="handleSearch">Search</button>
                <div v-if="searchQuery && posts.length > 0" class="search-results">
                    <ul>
                        <li v-for="result in posts" :key="result.id">
                            {{ result.content }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="feed">
            <h2>Recent Posts</h2>
            <ul>
                <li v-for="post in posts" :key="post.id" class="post-card">
                    <NuxtLink :to="`/posts/${post.id}`" class="post-title-link">
                        <h3>{{ post.title }}</h3>
                    </NuxtLink>
                    <p>{{ post.content }}</p>
                    <span>{{ post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now' }}</span>
                    <div class="post-actions">
                        <button @click="editPost(post)">Edit Post</button>
                        <button @click="deletePost(post.id)">Delete Post</button>
                    </div>
                </li>
            </ul>
        </div>

        <div class="new-post">
            <h2>Create New Post</h2>
            <form @submit.prevent="createNewPost">
                <div>
                    <label for="postTitle">Title:</label>
                    <input type="text" v-model="newPost.title" placeholder="Post Title" required />
                    <textarea v-model="newPost.content" placeholder="Post Content" required></textarea>
                    <button type="submit">Create Post</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { postService } from '../services/api'
import { API_URL } from '../constants'

// State
const posts = ref([])
const searchQuery = ref('')
const newPost = ref({
  title: '',
  content: ''
})

// Fetch posts on load
onMounted(async () => {
  console.log('Component mounted, fetching posts...')
  
  // Always add these fallback posts first so something is always visible
  posts.value = [
    { 
      id: 'sample1', 
      title: 'Connection Test Post', 
      content: 'If this is the only post you see, the API connection might not be working. Check if your backend server is running at port 8000 and that CORS is properly configured.', 
      createdAt: new Date().toISOString() 
    },
    { 
      id: 'sample2', 
      title: 'How to Create a Post', 
      content: 'Use the form below to create a new post. If the form submission fails, ensure your backend is running correctly.', 
      createdAt: new Date(Date.now() - 3600000).toISOString() 
    }
  ]
  
  try {
    console.log('Making API request to:', `${API_URL}/posts`)
    const response = await postService.getPosts()
    console.log('API Response:', response)
    
    if (response && response.data && response.data.length > 0) {
      console.log('Posts loaded from API:', response.data)
      posts.value = response.data
    } else {
      console.log('No posts returned from API, using fallback posts')
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
})

// Create new post
const createNewPost = async () => {
  try {
    const response = await postService.createPost(newPost.value)
    posts.value.unshift(response.data)
    newPost.value = { title: '', content: '' }
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

// Search posts
const handleSearch = async () => {
  if (searchQuery.value.trim() === '') {
    const response = await postService.getPosts()
    posts.value = response.data
    return
  }
  
  try {
    const response = await postService.searchPosts(searchQuery.value)
    posts.value = response.data
  } catch (error) {
    console.error('Error searching posts:', error)
  }
}

// Delete post
const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) return
  
  try {
    await postService.deletePost(id)
    posts.value = posts.value.filter(post => post.id !== id)
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

// Edit post
const editPost = async (post) => {
  try {
    const response = await postService.updatePost(post.id, post)
    const index = posts.value.findIndex(p => p.id === post.id)
    if (index !== -1) {
      posts.value[index] = response.data
    }
  } catch (error) {
    console.error('Error editing post:', error)
  }
}
</script>

<style>
.search-bar {
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 0.5rem 1rem;
  background-color: #4267B2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.feed {
  margin-bottom: 2rem;
}

.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  list-style-type: none;
}

.post-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.post-title-link {
  text-decoration: none;
  color: #4267B2;
}

.post-title-link:hover h3 {
  text-decoration: underline;
}

.post-card p {
  margin-bottom: 1rem;
}

.post-card span {
  display: block;
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.post-actions button {
  padding: 0.25rem 0.5rem;
  background-color: #f0f2f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.new-post {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-post form div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.new-post input, 
.new-post textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.new-post textarea {
  min-height: 100px;
  resize: vertical;
}

.new-post button {
  padding: 0.5rem 1rem;
  background-color: #4267B2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  margin-top: 0.5rem;
}

.search-results {
  margin-top: 1rem;
}

.search-results ul {
  padding: 0;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  margin-bottom: 1rem;
}

ul {
  padding: 0;
  margin: 0;
}
</style>
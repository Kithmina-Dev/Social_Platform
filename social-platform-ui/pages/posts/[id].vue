<template>
  <div>
    <div class="post-detail" v-if="post">
      <h1>{{ post.title }}</h1>
      <p class="post-content">{{ post.content }}</p>
      <span class="post-meta">Posted on {{ formatDate(post.createdAt) }}</span>
      
      <div class="post-actions">
        <button @click="goBack">Back</button>
        <button @click="editPost">Edit</button>
        <button @click="deletePost">Delete</button>
      </div>
    </div>
    <div v-else class="loading">
      <p>Loading post...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postService } from '../services/api';

const route = useRoute();
const router = useRouter();
const post = ref(null);

onMounted(async () => {
  const postId = route.params.id;
  
  try {
    const response = await postService.getPostById(postId);
    post.value = response.data;
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const goBack = () => {
  router.back();
};

const editPost = () => {
  router.push(`/posts/${post.value.id}/edit`);
};

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  
  try {
    await postService.deletePost(post.value.id);
    router.push('/');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};
</script>

<style>
.post-detail {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-detail h1 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.post-meta {
  display: block;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}

.post-actions button {
  padding: 0.5rem 1rem;
  background-color: #f0f2f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.post-actions button:first-child {
  background-color: #4267B2;
  color: white;
  border: none;
}

.post-actions button:last-child {
  background-color: #f44336;
  color: white;
  border: none;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>

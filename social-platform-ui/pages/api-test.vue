<template>
  <div>
    <h1>API Connection Test</h1>
    <div class="status">
      <p>API URL: {{ apiUrl }}</p>
      <p>Status: {{ status }}</p>
      <p v-if="error">Error: {{ error }}</p>
      <button @click="testConnection" class="test-button">Test API Connection</button>
    </div>
    
    <div class="test-form">
      <h2>Manual Post Creation Test</h2>
      <form @submit.prevent="createTestPost">
        <input v-model="testPost.title" placeholder="Post title" required />
        <textarea v-model="testPost.content" placeholder="Post content" required></textarea>
        <button type="submit">Create Test Post</button>
      </form>
    </div>
    
    <div class="results" v-if="results.length > 0">
      <h2>API Response</h2>
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '../constants';

const apiUrl = ref(API_URL);
const status = ref('Not tested');
const error = ref(null);
const results = ref([]);
const testPost = ref({
  title: 'Test Post',
  content: 'This is a test post created to verify API functionality'
});

const testConnection = async () => {
  status.value = 'Testing...';
  error.value = null;
  results.value = [];
  
  try {
    const response = await axios.get(`${API_URL}/posts`);
    status.value = 'Connected';
    results.value = response.data;
  } catch (err) {
    status.value = 'Failed';
    error.value = err.message;
    console.error('API Connection Error:', err);
  }
};

const createTestPost = async () => {
  status.value = 'Creating post...';
  error.value = null;
  
  try {
    const response = await axios.post(`${API_URL}/posts`, testPost.value);
    status.value = 'Post created';
    results.value = [response.data];
  } catch (err) {
    status.value = 'Failed to create post';
    error.value = err.message;
    console.error('API Post Creation Error:', err);
  }
};
</script>

<style scoped>
.status {
  background: #f0f2f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.test-button {
  background: #4267B2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.test-form {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.test-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.test-form input,
.test-form textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.test-form textarea {
  min-height: 100px;
}

.test-form button {
  background: #4267B2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.results {
  background: #f0f2f5;
  padding: 1rem;
  border-radius: 8px;
}

.results pre {
  white-space: pre-wrap;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
}
</style>

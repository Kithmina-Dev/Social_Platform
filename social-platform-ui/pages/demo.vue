<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Social Feed (Demo Mode)</h1>
      <p>This is a demonstration with static data. Backend connection not required.</p>
    </div>

    <div class="feed">
      <h2>Demo Posts</h2>
      <ul>
        <li v-for="post in demoData" :key="post.id" class="post-card">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <span>Posted on {{ formatDate(post.createdAt) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Demo data that will always show
const demoData = ref([
  {
    id: 'demo1',
    title: 'Welcome to the Social Platform',
    content: 'This is a sample post to show the UI layout. If you see this instead of real posts, it means the backend API connection is not working properly.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo2',
    title: 'How to create posts',
    content: 'Use the form below to create a new post. Make sure your backend server is running at http://localhost:8000 and the database is properly configured.',
    createdAt: new Date(Date.now() - 86400000).toISOString() // yesterday
  }
]);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  margin-bottom: 1rem;
}

.page-header p {
  color: #ff0000;
  font-weight: bold;
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

ul {
  padding: 0;
  margin: 0;
}
</style>

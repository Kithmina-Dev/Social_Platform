# Social Media Platform Project Guide

## Backend Status ✅ COMPLETE

Your NestJS backend is fully operational with:

- PostgreSQL database connected and working
- Post model with CRUD operations functional
- API endpoints tested and verified in Postman

## Frontend Development Plan 🚀

### Step 1: Create Nuxt.js Project

```bash
# Navigate to the parent directory
cd ..

# Create a new Nuxt.js project
npx nuxi init social-platform-ui

# Navigate to the project
cd social-platform-ui

# Install dependencies
npm install
```

### Step 2: Configure Nuxt.js for API Communication

```bash
# Install axios for API requests
npm install axios

# Create API service files
mkdir -p services
touch services/api.js
```

### Step 3: Create Components

1. **Layouts**
   - Main layout with navigation
   - Post feed layout

2. **Post Components**
   - Post creation form
   - Post card display
   - Post list component
   - Post editing modal

3. **UI Components**
   - Search bar
   - Loading indicator
   - Error messages
   - Pagination controls

### Step 4: Implement Pages

1. **Home/Feed Page**
   - Display all posts
   - Search functionality

2. **Create Post Page**
   - Form for creating posts
   - Image upload (future)

3. **Post Details Page**
   - View single post
   - Edit/delete options

### Step 5: Connect to API

Create service for each API endpoint:

```javascript
// services/postService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Get all posts
  getPosts() {
    return apiClient.get('/posts');
  },

  // Get a single post
  getPost(id) {
    return apiClient.get(`/posts/${id}`);
  },

  // Create a new post
  createPost(post) {
    return apiClient.post('/posts', post);
  },

  // Update a post
  updatePost(id, post) {
    return apiClient.patch(`/posts/${id}`, post);
  },

  // Delete a post
  deletePost(id) {
    return apiClient.delete(`/posts/${id}`);
  },

  // Search posts
  searchPosts(query) {
    return apiClient.get(`/posts/search?q=${query}`);
  },
};
```

### Step 6: Styling

1. Use TailwindCSS or other CSS framework
2. Create social media-like UI design
3. Responsive layout for mobile and desktop

### Step 7: Additional Features

1. Implement Typesense for advanced search
2. Add user authentication
3. Add file uploading for post images

## How to Run Both Projects

```bash
# Terminal 1 - Backend
cd social-platform
npm run start:prod

# Terminal 2 - Frontend
cd ../social-platform-ui
npm run dev
```

## Future Enhancements

1. User profiles
2. Post likes/comments
3. Notifications
4. Friend/follow system
5. Direct messaging

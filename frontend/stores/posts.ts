import { defineStore } from 'pinia';
import axios from '../plugins/axios';

interface Post {
  id: string;
  title: string;
  content: string;
  likes?: number;
  liked?: boolean;
  [key: string]: any;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    loading: false,
    error: null as string | null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    } as PaginationState
  }),

  getters: {
    getAllPosts: (state) => state.posts,
    getCurrentPost: (state) => state.currentPost,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination
  },

  actions: {
    async fetchPosts(page = 1, limit = 10, search: string | null = null, tags: string[] | string | null = null) {
      this.loading = true;
      this.error = null;
      
      try {
        // Build query parameters
        const params: Record<string, any> = { page, limit };
        if (search) params.search = search;
        if (tags) params.tags = Array.isArray(tags) ? tags.join(',') : tags;
        
        // Call your posts API
        const response = await axios.get('/api/posts', { params });
        
        this.posts = response.data.items || response.data;
        
        // Update pagination if available
        if (response.data.meta) {
          this.pagination = {
            page: response.data.meta.currentPage,
            limit: response.data.meta.itemsPerPage,
            total: response.data.meta.totalItems,
            totalPages: response.data.meta.totalPages
          };
        }
        
        return this.posts;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch posts.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchPostById(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Call your post detail API
        const response = await axios.get(`/api/posts/${id}`);
        
        this.currentPost = response.data;
        return this.currentPost;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch post details.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createPost(postData: any) {
      this.loading = true;
      this.error = null;
      
      try {
        // Handle FormData or JSON data
        let config = {};
        if (postData instanceof FormData) {
          config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
        }
        
        // Call your post creation API
        const response = await axios.post('/api/posts', postData, config);
        
        // Add the new post to the posts list
        if (Array.isArray(this.posts)) {
          this.posts.unshift(response.data);
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create post.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updatePost(id: string, postData: any) {
      this.loading = true;
      this.error = null;
      
      try {
        // Handle FormData or JSON data
        let config = {};
        if (postData instanceof FormData) {
          config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
        }
        
        // Call your post update API
        const response = await axios.put(`/api/posts/${id}`, postData, config);
        
        // Update the post in the posts list
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
          this.posts[index] = response.data;
        }
        
        // Update current post if it matches
        if (this.currentPost && this.currentPost.id === id) {
          this.currentPost = response.data;
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update post.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deletePost(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Call your post deletion API
        await axios.delete(`/api/posts/${id}`);
        
        // Remove the post from the posts list
        this.posts = this.posts.filter(post => post.id !== id);
        
        // Clear current post if it matches
        if (this.currentPost && this.currentPost.id === id) {
          this.currentPost = null;
        }
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete post.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async likePost(id: string) {
      try {
        // Call your like post API
        const response = await axios.post(`/api/posts/${id}/like`);
        
        // Update the post in the posts list
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
          this.posts[index].likes = response.data.likes;
          this.posts[index].liked = true;
        }
        
        // Update current post if it matches
        if (this.currentPost && this.currentPost.id === id) {
          this.currentPost.likes = response.data.likes;
          this.currentPost.liked = true;
        }
        
        return response.data;
      } catch (error: any) {
        console.error('Failed to like post:', error);
        throw error;
      }
    },
    
    async unlikePost(id: string) {
      try {
        // Call your unlike post API
        const response = await axios.post(`/api/posts/${id}/unlike`);
        
        // Update the post in the posts list
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
          this.posts[index].likes = response.data.likes;
          this.posts[index].liked = false;
        }
        
        // Update current post if it matches
        if (this.currentPost && this.currentPost.id === id) {
          this.currentPost.likes = response.data.likes;
          this.currentPost.liked = false;
        }
        
        return response.data;
      } catch (error: any) {
        console.error('Failed to unlike post:', error);
        throw error;
      }
    }
  }
});

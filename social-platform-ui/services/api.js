//API Service to interact with Backend
import axios from "axios";
import { API_URL } from "../constants";

console.log('API Service initialized with URL:', API_URL);

// Create axios instance
export const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Add interceptors for debugging
apiService.interceptors.request.use(request => {
    console.log('API Request:', request);
    return request;
});

apiService.interceptors.response.use(
    response => {
        console.log('API Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const postService = {
    getPosts: () => apiService.get("/posts"),
    getPostById: (id) => apiService.get(`/posts/${id}`),
    createPost: (postData) => apiService.post("/posts", postData),
    updatePost: (id, postData) => apiService.put(`/posts/${id}`, postData),
    deletePost: (id) => apiService.delete(`/posts/${id}`),
    searchPosts: (query) => apiService.get(`/posts/search?q=${encodeURIComponent(query)}`),
}

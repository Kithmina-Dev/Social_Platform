import { ref, computed } from "vue";
import { useApi } from "./useApi";

// Define types
interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  files?: Array<{
    id: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }>;
}

interface CreatePostData {
  title: string;
  content: string;
  image?: File;
}

interface UpdatePostData {
  title: string;
  content: string;
  image?: File;
}

// Composable for managing posts
export const usePosts = () => {
  // State
  const posts = useState<Post[]>("posts", () => []);
  const isLoading = useState<boolean>("posts_loading", () => false);
  const isLoadingMore = useState<boolean>("posts_loading_more", () => false);
  const error = useState<string | null>("posts_error", () => null);
  const currentPage = useState<number>("posts_page", () => 1);
  const hasMorePosts = useState<boolean>("posts_has_more", () => true);
  const pageSize = 10;

  // Get API methods
  const api = useApi();

  // Getters
  const sortedPosts = computed(() => {
    return [...posts.value].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  // Fetch posts with pagination
  const fetchPosts = async (page = 1) => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log(`Fetching posts, page ${page}`);

      const response = await api.get("/api/posts", {
        params: {
          page,
          limit: pageSize,
        },
      });

      console.log("Posts API response:", response);

      // Handle different response structures
      let fetchedPosts: Post[] = [];
      let hasMore = false;

      if (response && Array.isArray(response)) {
        // Direct array of posts
        fetchedPosts = response as Post[];
      } else if (response && typeof response === "object") {
        const resp = response as any;
        if (resp.posts && Array.isArray(resp.posts)) {
          // { posts: Post[], hasMore: boolean }
          fetchedPosts = resp.posts;
          hasMore = !!resp.hasMore;
        } else if (resp.data && Array.isArray(resp.data)) {
          // { data: Post[], ... }
          fetchedPosts = resp.data;
          hasMore = resp.data.length >= pageSize;
        } else if (
          Object.keys(resp).length > 0 &&
          !("posts" in resp) &&
          !("data" in resp)
        ) {
          // Assume it's a single post object
          fetchedPosts = [resp as Post];
        }
      }

      if (page === 1) {
        posts.value = fetchedPosts;
      } else {
        posts.value.push(...fetchedPosts);
      }

      hasMorePosts.value = hasMore;
      currentPage.value = page;
    } catch (err: any) {
      error.value = err.data?.message || "Failed to fetch posts";
      console.error("Error fetching posts:", err);

      // Initialize with empty array to stop "not iterable" issues
      if (page === 1) {
        posts.value = [];
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Load more posts (next page)
  const loadMorePosts = async () => {
    if (isLoadingMore.value || !hasMorePosts.value) return;

    try {
      isLoadingMore.value = true;
      await fetchPosts(currentPage.value + 1);
    } finally {
      isLoadingMore.value = false;
    }
  };

  // Create a new post
  const createPost = async (postData: CreatePostData) => {
    try {
      const formData = new FormData();

      // Use the title provided or generate one from content
      formData.append(
        "title",
        postData.title ||
          postData.content.substring(0, 50) +
            (postData.content.length > 50 ? "..." : "")
      );
      formData.append("content", postData.content);

      if (postData.image) {
        formData.append("file", postData.image);
        console.log("Appending file to FormData:", {
          fileName: postData.image.name,
          fileType: postData.image.type,
          fileSize: postData.image.size,
        });
      }

      const response = await api.uploadFile("/api/posts", formData);

      //console.log('Create post response:', response);

      // Handle different response structures to extract the post
      let newPost: Post;

      if (response && typeof response === "object") {
        const resp = response as any;
        // Check if the post is in a nested data property
        if (resp.data && typeof resp.data === "object") {
          newPost = resp.data as Post;
        } else {
          // Assume the response itself is the post
          newPost = resp as Post;
        }

        // Add the new post to the beginning of the list
        console.log("Adding new post to store:", newPost);
        posts.value.unshift(newPost);

        // Immediately reload posts to ensure we have the latest data including images
        console.log("Reloading posts to refresh the list");
        await fetchPosts();
      } else {
        console.error("Unexpected post creation response format:", response);
        throw new Error("Invalid response format from server");
      }

      return newPost;
    } catch (err: any) {
      //console.error('Post creation failed details:', err);
      error.value = err.data?.message || "Failed to create post";
      throw err;
    }
  };

  // Update an existing post
  const updatePost = async (postId: string, postData: UpdatePostData) => {
    try {
      const formData = new FormData();

      // Use the title provided or generate one from content
      formData.append(
        "title",
        postData.title ||
          postData.content.substring(0, 50) +
            (postData.content.length > 50 ? "..." : "")
      );
      formData.append("content", postData.content);

      if (postData.image) {
        formData.append("file", postData.image);
      }

      const updatedPost = await api.request<Post>(`/api/posts/${postId}`, {
        method: "PUT",
        body: formData,
      });

      // Update the post in the list
      const index = posts.value.findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      return updatedPost;
    } catch (err: any) {
      error.value = err.data?.message || "Failed to update post";
      throw err;
    }
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    try {
      await api.delete(`/api/posts/${postId}`);

      // Remove the post from the list
      posts.value = posts.value.filter((p) => p.id !== postId);
    } catch (err: any) {
      error.value = err.data?.message || "Failed to delete post";
      throw err;
    }
  };

  // Like/unlike a post
  const likePost = async (postId: string) => {
    try {
      console.log(`Toggling like for post ${postId}`);

      const response = await api.post(`/api/posts/${postId}/like`);

      console.log("Like response data:", response);

      // Get response data depending on API response structure
      const responseData = (response as any).data || response;

      // Update the post's like status based on the server response
      const post = posts.value.find((p) => p.id === postId);
      if (post) {
        // If we have server data, use it
        if (responseData) {
          post.isLiked = responseData.liked;
          post.likes = responseData.likeCount;
        } else {
          // Fallback to client-side toggle if server doesn't return data
          post.isLiked = !post.isLiked;
          post.likes = (post.likes || 0) + (post.isLiked ? 1 : -1);
          /*console.log(
            `Fallback post like status: liked=${post.isLiked}, count=${post.likes}`
          );*/
        }
      }

      return response;
    } catch (err: any) {
      console.error("Error liking post:", err);
      throw err;
    }
  };

  // Clear posts from state
  const clearPosts = () => {
    posts.value = [];
    currentPage.value = 1;
    hasMorePosts.value = true;
    error.value = null;
  };

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
    clearPosts,
  };
};

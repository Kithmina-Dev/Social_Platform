import { defineStore } from "pinia";
import { usePosts as usePostsComposable } from "~/composables/usePosts";

export const usePostsStore = defineStore("posts", () => {
  const {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMorePosts,
    sortedPosts,
    fetchPosts,
    loadMorePosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    clearPosts,
  } = usePostsComposable();

  // Return the same interface as before to maintain compatibility
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
});

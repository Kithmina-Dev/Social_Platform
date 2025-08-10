import { defineStore } from "pinia";
import { useProfile as useProfileComposable } from "~/composables/useProfile";
import { usePosts } from "~/composables/usePosts";
import { ref } from "vue";

export const useProfileStore = defineStore("profile", () => {
  const {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
  } = useProfileComposable();

  // We still need userPosts which isn't in the profile composable
  const userPosts = ref<any[]>([]);

  // Use the posts composable to handle post related functionality
  const { fetchPosts: fetchPostsByApi } = usePosts();

  // Create a specialized function to fetch a user's posts
  const fetchUserPosts = async (username: string) => {
    try {
      isLoading.value = true;

      // Get posts by username - use the API directly
      const response = await fetch(
        `${useRuntimeConfig().public.apiBaseUrl}/api/posts/user/${username}`
      );
      const data = await response.json();

      if (response.ok) {
        userPosts.value = data.data ? data.data : data;
        console.log(
          `Fetched ${userPosts.value.length} posts for user ${username}`,
          userPosts.value
        );
      } else {
        console.error("Error fetching user posts:", data);
        userPosts.value = [];
      }

      return userPosts.value;
    } catch (err: any) {
      console.error("Error fetching user posts:", err);
      error.value = err.data?.message || "Failed to load posts";
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Clear profile data
  const clearProfile = () => {
    profile.value = null;
    userPosts.value = [];
    error.value = null;
  };

  return {
    // State
    profile,
    userPosts,
    isLoading,
    error,

    // Methods
    fetchProfile,
    fetchUserPosts,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    clearProfile,
  };
});

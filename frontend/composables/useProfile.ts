import { ref } from "vue";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

// Define types
interface Profile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  displayName?: string;
  location?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
}

interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
}

// Composable for managing user profile data
export const useProfile = () => {
  // State
  const profile = useState<Profile | null>("current_profile", () => null);
  const isLoading = useState<boolean>("profile_loading", () => false);
  const error = useState<string | null>("profile_error", () => null);

  // Get API methods and auth state
  const api = useApi();
  const { user } = useAuth();

  // Fetch user profile by username
  const fetchProfile = async (username: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await api.get<any>(`/api/users/profile/${username}`);

      // Handle different response structures
      let profileData: Profile;

      if (response && typeof response === "object") {
        profileData =
          "data" in response ? (response as any).data : (response as Profile);
        profile.value = profileData;
      } else {
        throw new Error("Invalid response format");
      }

      return profileData;
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      error.value = err.data?.message || "Failed to fetch profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update the current user's profile
  const updateProfile = async (data: UpdateProfileData, avatar?: File) => {
    try {
      isLoading.value = true;
      error.value = null;

      // If avatar is provided, use FormData
      if (avatar) {
        const formData = new FormData();

        if (data.displayName) formData.append("displayName", data.displayName);
        if (data.bio) formData.append("bio", data.bio);
        if (data.location) formData.append("location", data.location);
        if (data.website) formData.append("website", data.website);

        formData.append("avatar", avatar);

        const response = await api.request<any>("/api/users/profile", {
          method: "PUT",
          body: formData,
        });

        // Handle different response structures
        const updatedProfile =
          "data" in response ? (response as any).data : (response as Profile);

        // Update local profile state
        profile.value = updatedProfile;

        // Update the auth user state as well for consistency
        if (user.value) {
          user.value = {
            ...user.value,
            ...updatedProfile,
          };
        }

        return updatedProfile;
      } else {
        const response = await api.request<any>("/api/users/profile", {
          method: "PUT",
          body: data,
        });

        // Handle different response structures
        const updatedProfile =
          "data" in response ? (response as any).data : (response as Profile);

        // Update local profile state
        profile.value = updatedProfile;

        // Update the auth user state as well for consistency
        if (user.value) {
          user.value = {
            ...user.value,
            ...updatedProfile,
          };
        }

        return updatedProfile;
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      error.value = err.data?.message || "Failed to update profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Follow a user
  const followUser = async (username: string) => {
    try {
      const response = await api.post<any>(`/api/users/follow/${username}`);

      // If we're viewing this user's profile, update the following status
      if (profile.value && profile.value.username === username) {
        profile.value.isFollowing = true;
        if (profile.value.followersCount !== undefined) {
          profile.value.followersCount += 1;
        }
      }

      return response;
    } catch (err: any) {
      console.error("Error following user:", err);
      error.value = err.data?.message || "Failed to follow user";
      throw err;
    }
  };

  // Unfollow a user
  const unfollowUser = async (username: string) => {
    try {
      const response = await api.delete<any>(`/api/users/follow/${username}`);

      // If we're viewing this user's profile, update the following status
      if (profile.value && profile.value.username === username) {
        profile.value.isFollowing = false;
        if (profile.value.followersCount !== undefined) {
          profile.value.followersCount -= 1;
        }
      }

      return response;
    } catch (err: any) {
      console.error("Error unfollowing user:", err);
      error.value = err.data?.message || "Failed to unfollow user";
      throw err;
    }
  };

  // Get user's followers
  const getFollowers = async (username: string) => {
    try {
      const response = await api.get<any>(`/api/users/followers/${username}`);

      return response;
    } catch (err: any) {
      console.error("Error fetching followers:", err);
      error.value = err.data?.message || "Failed to fetch followers";
      throw err;
    }
  };

  // Get users the user is following
  const getFollowing = async (username: string) => {
    try {
      const response = await api.get<any>(`/api/users/following/${username}`);

      return response;
    } catch (err: any) {
      console.error("Error fetching following:", err);
      error.value = err.data?.message || "Failed to fetch following";
      throw err;
    }
  };

  return {
    // State
    profile,
    isLoading,
    error,

    // Methods
    fetchProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
  };
};

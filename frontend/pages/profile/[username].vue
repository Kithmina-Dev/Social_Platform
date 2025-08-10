<template>
  <div class="container mx-auto py-6 px-4">
    <div v-if="isLoading" class="flex justify-center p-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <template v-else-if="profileError">
      <div
        class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center"
      >
        <p class="font-medium">{{ profileError }}</p>
        <BaseButton class="mt-4" @click="$router.push('/explore')"
          >Back to Explore</BaseButton
        >
      </div>
    </template>

    <template v-else-if="userProfile">
      <!-- Profile Header -->
      <ProfileHeader
        :profile="userProfile"
        :isOwnProfile="isOwnProfile"
        :stats="profileStats"
      />

      <!-- Profile Content Tabs -->
      <ProfileTabMenu v-model="activeTab" @tab-change="activeTab = $event" />

      <!-- Tab Content -->
      <div>
        <!-- Posts Tab -->
        <div v-if="activeTab === 'posts'">
          <UserPostsGrid :posts="userPosts" :isOwnProfile="isOwnProfile" />
        </div>

        <!-- Other tabs -->
        <div
          v-else-if="activeTab === 'media'"
          class="text-center py-12 text-gray-500"
        >
          Media content coming soon
        </div>

        <div
          v-else-if="activeTab === 'likes'"
          class="text-center py-12 text-gray-500"
        >
          Liked content coming soon
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Define page meta
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Import components
import ProfileHeader from "~/components/profile/ProfileHeader.vue";
import ProfileTabMenu from "~/components/profile/ProfileTabMenu.vue";
import ProfileStats from "~/components/profile/ProfileStats.vue";
import UserPostsGrid from "~/components/profile/UserPostsGrid.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

// States
const isLoading = ref(true);
const profileError = ref<string | null>(null);
const activeTab = ref("posts");

// Get username from URL parameter
const username = computed(() => route.params.username as string);

// Check if viewing own profile
const isOwnProfile = computed(() => {
  return authStore.currentUser?.username === username.value;
});

// User profile data
const userProfile = computed(() => profileStore.profile);

// User posts
const userPosts = computed(() => profileStore.userPosts);

// Profile statistics with proper typing
const profileStats = computed(() => ({
  postsCount: userProfile.value?.postsCount || 0,
  followingCount: userProfile.value?.followingCount || 0,
  followersCount: userProfile.value?.followersCount || 0,
}));

// Load profile data
onMounted(async () => {
  try {
    isLoading.value = true;
    profileError.value = null;

    // Check if username is undefined and redirect to user's own profile if needed
    if (!username.value && authStore.currentUser?.username) {
      console.log(
        "Username parameter is undefined, redirecting to own profile"
      );
      router.replace(`/profile/${authStore.currentUser.username}`);
      return;
    }

    const usernameToFetch = username.value || authStore.currentUser?.username;
    if (!usernameToFetch) {
      profileError.value = "No user profile to display";
      return;
    }

    // Fetch profile data
    await profileStore.fetchProfile(usernameToFetch);

    // Fetch user posts
    await profileStore.fetchUserPosts(usernameToFetch);
  } catch (error: any) {
    console.error("Error loading profile:", error);
    profileError.value = "Failed to load profile. The user may not exist.";
  } finally {
    isLoading.value = false;
  }
});
</script>
